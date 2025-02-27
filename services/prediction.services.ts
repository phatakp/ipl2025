import { and, eq, max, ne, sql } from "drizzle-orm";

import { CompletePred, Pred } from "@/app/types";
import {
    matchDefaultSchema,
    matchNumSchema,
    matchParams,
    matches,
} from "@/db/schema/matches.schema";
import {
    insertPredParams,
    predDoubleSchema,
    predictions,
    updatePredParams,
} from "@/db/schema/predictions.schema";
import { profiles } from "@/db/schema/profiles.schema";
import { getCurrentISTDate, getISTDate } from "@/lib/utils";
import { protectedProcedure } from "@/lib/zsa";

const shortProfile = {
    userId: true,
    firstName: true,
    lastName: true,
    imageUrl: true,
};

class PredictionService {
    getMatchPredictions = protectedProcedure
        .createServerAction()
        .input(matchNumSchema)
        .handler(async ({ ctx: { db }, input: { num } }) => {
            const rows = await db.query.predictions.findMany({
                where: (predictions, { eq }) => eq(predictions.matchNum, num),
                with: {
                    user: {
                        columns: shortProfile,
                    },
                    team: {
                        columns: { longName: true },
                    },
                    match: {
                        with: {
                            team1: {
                                columns: { longName: true },
                            },
                            team2: {
                                columns: { longName: true },
                            },
                            winner: {
                                columns: { longName: true },
                            },
                        },
                    },
                },
                orderBy: (predictions, { desc }) => [
                    desc(predictions.resultAmt),
                    desc(predictions.amount),
                ],
            });
            return rows as CompletePred[];
        });

    getUserPredictions = protectedProcedure
        .createServerAction()
        .handler(async ({ ctx: { db, session } }) => {
            const rows = await db.query.predictions.findMany({
                where: (predictions, { eq }) =>
                    eq(predictions.userId, session.user.id),
                with: {
                    user: {
                        columns: shortProfile,
                    },
                    team: {
                        columns: { longName: true },
                    },
                    match: {
                        with: {
                            team1: {
                                columns: { longName: true },
                            },
                            team2: {
                                columns: { longName: true },
                            },
                            winner: {
                                columns: { longName: true },
                            },
                        },
                    },
                },
                orderBy: (predictions, { desc }) => [
                    desc(predictions.matchNum),
                ],
            });
            return rows as CompletePred[];
        });

    getUserPredictionForMatch = protectedProcedure
        .createServerAction()
        .input(matchNumSchema)
        .handler(async ({ ctx: { db, session }, input: { num } }) => {
            const row = await db.query.predictions.findFirst({
                where: (predictions, { eq, and }) =>
                    and(
                        eq(predictions.matchNum, num),
                        eq(predictions.userId, session.user.id)
                    ),
                with: {
                    user: {
                        columns: shortProfile,
                    },
                    team: {
                        columns: { longName: true },
                    },
                    match: {
                        with: {
                            team1: {
                                columns: { longName: true },
                            },
                            team2: {
                                columns: { longName: true },
                            },
                            winner: {
                                columns: { longName: true },
                            },
                        },
                    },
                },
            });
            return row as CompletePred;
        });

    getMaxPredictionForMatch = protectedProcedure
        .createServerAction()
        .input(matchNumSchema)
        .handler(async ({ ctx: { db, session }, input: { num } }) => {
            const [row] = await db
                .select({ maxAmt: max(predictions.amount) })
                .from(predictions)
                .where(
                    and(
                        eq(predictions.matchNum, num),
                        eq(predictions.status, "placed")
                    )
                );
            return row.maxAmt ?? 0;
        });

    createPrediction = protectedProcedure
        .createServerAction()
        .input(insertPredParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [row] = await db
                .insert(predictions)
                .values({ ...input, userId: session.user.id })
                .returning();
            return row as Pred;
        });

    addDefaultPredictionsForMatch = protectedProcedure
        .createServerAction()
        .input(matchDefaultSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const newPredCutoff = getISTDate(input.date, -30);
            const currentISTTime = getCurrentISTDate();
            if (currentISTTime >= newPredCutoff) {
                const players = await db
                    .select({ profile: profiles })
                    .from(profiles)
                    .leftJoin(
                        predictions,
                        eq(profiles.userId, predictions.userId)
                    )
                    .where(
                        and(
                            eq(predictions.matchNum, input.num),
                            ne(predictions.status, "placed")
                        )
                    );
                players?.forEach(async (p) => {
                    await db.insert(predictions).values({
                        matchNum: input.num,
                        userId: p.profile.userId,
                        amount: input.minStake,
                        status: "default",
                    });
                });
            }
        });

    updatePrediction = protectedProcedure
        .createServerAction()
        .input(updatePredParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [row] = await db
                .update(predictions)
                .set({ ...input, isUpdated: true, updatedAt: sql`NOW()` })
                .where(
                    and(
                        eq(predictions.id, input.id),
                        eq(predictions.userId, session.user.id)
                    )
                )
                .returning();
            return row as Pred;
        });

    playDoublePrediction = protectedProcedure
        .createServerAction()
        .input(predDoubleSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [maxAmt] = await this.getMaxPredictionForMatch({
                num: input.matchNum,
            });
            let amt = input.amount * 2;
            if ((maxAmt ?? 0) > amt) amt = (maxAmt ?? 0) + 10;
            return await db.transaction(async (tx) => {
                await tx
                    .update(matches)
                    .set({ isDoublePlayed: true })
                    .where(eq(matches.num, input.matchNum));
                await tx
                    .update(profiles)
                    .set({ doublesLeft: sql`${profiles.doublesLeft} - 1` })
                    .where(eq(profiles.userId, session.user.id));

                const [row] = await tx
                    .update(predictions)
                    .set({
                        ...input,
                        isUpdated: true,
                        updatedAt: sql`NOW()`,
                        isDouble: true,
                        amount: amt,
                    })
                    .where(
                        and(
                            eq(predictions.id, input.id),
                            eq(predictions.userId, session.user.id)
                        )
                    )
                    .returning();
                return row as Pred;
            });
        });

    settleCompletedPredictions = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [preds] = await this.getMatchPredictions({ num: input.num });

            const totalWon =
                preds?.reduce(
                    (acc, r) =>
                        r.teamName === input.winnerName ? acc + r.amount : acc,
                    0
                ) ?? 0;
            const totalLost =
                preds?.reduce(
                    (acc, r) =>
                        r.teamName !== input.winnerName ? acc + r.amount : acc,
                    0
                ) ?? 0;
            preds?.forEach(async (pred: CompletePred) => {
                const status =
                    pred.teamName === input.winnerName &&
                    totalWon > 0 &&
                    totalLost > 0
                        ? "won"
                        : totalWon > 0 && totalLost > 0
                          ? "lost"
                          : "no_result";
                const resultAmt =
                    pred.teamName === input.winnerName &&
                    totalWon > 0 &&
                    totalLost > 0 &&
                    pred.isDouble
                        ? (pred.amount / totalWon) * totalLost + totalLost
                        : pred.teamName === input.winnerName &&
                            totalWon > 0 &&
                            totalLost > 0
                          ? (pred.amount / totalWon) * totalLost
                          : totalWon > 0 &&
                              totalLost > 0 &&
                              input.isDoublePlayed
                            ? pred.amount * -2
                            : totalWon > 0 && totalLost > 0
                              ? pred.amount * -1
                              : 0;
                await db
                    .update(predictions)
                    .set({ status, resultAmt })
                    .where(eq(predictions.id, pred.id));
                if (resultAmt !== 0)
                    await db
                        .update(profiles)
                        .set({ balance: sql`${profiles.balance}+${resultAmt}` })
                        .where(eq(profiles.userId, pred.userId));
            });
        });

    settleAbandonedPredictions = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [preds] = await this.getMatchPredictions({ num: input.num });

            const totalWon =
                preds?.reduce(
                    (acc, r) => (r.status !== "default" ? acc + r.amount : acc),
                    0
                ) ?? 0;
            const totalLost =
                preds?.reduce(
                    (acc, r) => (r.status === "default" ? acc + r.amount : acc),
                    0
                ) ?? 0;
            preds?.forEach(async (pred: CompletePred) => {
                const status =
                    pred.status !== "default" && totalWon > 0 && totalLost > 0
                        ? "won"
                        : totalWon > 0 && totalLost > 0
                          ? "lost"
                          : "no_result";
                const resultAmt =
                    pred.status !== "default" &&
                    totalWon > 0 &&
                    totalLost > 0 &&
                    pred.isDouble
                        ? (pred.amount / totalWon) * totalLost + totalLost
                        : pred.teamName === input.winnerName &&
                            totalWon > 0 &&
                            totalLost > 0
                          ? (pred.amount / totalWon) * totalLost
                          : totalWon > 0 &&
                              totalLost > 0 &&
                              input.isDoublePlayed
                            ? pred.amount * -2
                            : totalWon > 0 && totalLost > 0
                              ? pred.amount * -1
                              : 0;
                await db
                    .update(predictions)
                    .set({ status, resultAmt })
                    .where(eq(predictions.id, pred.id));
                if (resultAmt !== 0)
                    await db
                        .update(profiles)
                        .set({ balance: sql`${profiles.balance}+${resultAmt}` })
                        .where(eq(profiles.userId, pred.userId));
            });
        });
}

export default new PredictionService();
