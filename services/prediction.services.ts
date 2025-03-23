import { and, eq, inArray, isNull, max, min, ne, sql } from "drizzle-orm";

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
import { profileIdSchema, profiles } from "@/db/schema/profiles.schema";
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

    getScheduledPredictionStats = protectedProcedure
        .createServerAction()
        .input(matchNumSchema)
        .handler(async ({ ctx: { db }, input: { num } }) => {
            return await db
                .select({
                    team: predictions.teamName,
                    count: sql<number>`cast(count(${predictions.teamName}) as int)`,
                    amount: sql`sum(${predictions.amount})`.mapWith(Number),
                })
                .from(predictions)
                .where(eq(predictions.matchNum, num))
                .groupBy(predictions.teamName);
        });

    getCompletedPredictionStats = protectedProcedure
        .createServerAction()
        .input(matchNumSchema)
        .handler(async ({ ctx: { db }, input: { num } }) => {
            return await db
                .select({
                    status: predictions.status,
                    count: sql<number>`cast(count(${predictions.teamName}) as int)`,
                    resultAmt: sql`sum(${predictions.resultAmt})`.mapWith(
                        Number
                    ),
                })
                .from(predictions)
                .where(eq(predictions.matchNum, num))
                .groupBy(predictions.status);
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

    getCompletedPredictionsForUser = protectedProcedure
        .createServerAction()
        .input(profileIdSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const rows = await db.query.predictions.findMany({
                limit: 5,
                where: (predictions, { eq, and }) =>
                    and(
                        eq(predictions.userId, input.userId),
                        inArray(predictions.status, [
                            "won",
                            "lost",
                            "no_result",
                        ])
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
                orderBy: (predictions, { desc }) => [
                    desc(predictions.matchNum),
                ],
            });
            const ipl = await db.query.predictions.findFirst({
                where: (predictions, { eq, and }) =>
                    and(
                        eq(predictions.userId, input.userId),
                        eq(predictions.matchNum, 0),
                        inArray(predictions.status, [
                            "won",
                            "lost",
                            "no_result",
                        ])
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
            return [ipl ?? {}, ...rows] as CompletePred[];
        });

    getAllPredictions = protectedProcedure
        .createServerAction()
        .handler(async ({ ctx: { db, session } }) => {
            const rows = await db.query.predictions.findMany({
                where: (predictions, { ne, and, inArray }) =>
                    and(
                        ne(predictions.matchNum, 0),
                        inArray(predictions.status, [
                            "won",
                            "lost",
                            "no_result",
                        ])
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
                orderBy: (predictions, { desc }) => [
                    desc(predictions.matchNum),
                ],
            });
            return rows as CompletePred[];
        });

    getAllIPLPredictions = protectedProcedure
        .createServerAction()
        .handler(async ({ ctx: { db, session }, input }) => {
            const rows = await db.query.predictions.findMany({
                where: (predictions, { eq, and, inArray }) =>
                    and(
                        eq(predictions.matchNum, 0),
                        inArray(predictions.status, [
                            "won",
                            "lost",
                            "no_result",
                        ])
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

    getMaxWonAmount = protectedProcedure
        .createServerAction()
        .input(profileIdSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [row] = await db
                .select({ maxAmt: max(predictions.resultAmt) })
                .from(predictions)
                .where(
                    and(
                        eq(predictions.userId, input.userId),
                        ne(predictions.matchNum, 0),
                        eq(predictions.status, "won")
                    )
                );
            return row.maxAmt ?? 0;
        });

    getMaxLostAmount = protectedProcedure
        .createServerAction()
        .input(profileIdSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [row] = await db
                .select({ maxAmt: min(predictions.resultAmt) })
                .from(predictions)
                .where(
                    and(
                        eq(predictions.userId, input.userId),
                        ne(predictions.matchNum, 0),
                        eq(predictions.status, "lost")
                    )
                );
            return row.maxAmt ?? 0;
        });

    getPredictionAccuracy = protectedProcedure
        .createServerAction()
        .input(profileIdSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [row] = await db.query.predictions.findMany({
                extras: {
                    total: db
                        .$count(
                            predictions,
                            and(
                                eq(predictions.userId, input.userId),
                                ne(predictions.matchNum, 0),
                                ne(predictions.status, "placed")
                            )
                        )
                        .as("total"),
                    correct: db
                        .$count(
                            predictions,
                            and(
                                eq(predictions.userId, input.userId),
                                eq(predictions.status, "won"),
                                ne(predictions.matchNum, 0)
                            )
                        )
                        .as("correct"),
                },
            });
            return { total: row.total, correct: row.correct };
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
                const sq = db
                    .select()
                    .from(predictions)
                    .where(
                        and(
                            eq(predictions.matchNum, input.num),
                            eq(predictions.status, "placed")
                        )
                    )
                    .as("sq");
                const players = await db
                    .select({ profile: profiles })
                    .from(profiles)
                    .leftJoin(sq, eq(profiles.userId, sq.userId))
                    .where(isNull(sq.id));

                players?.forEach(async (p) => {
                    await db
                        .insert(predictions)
                        .values({
                            matchNum: input.num,
                            userId: p.profile.userId,
                            amount: input.minStake,
                            status: "default",
                        })
                        .onConflictDoNothing();
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
            return await db.transaction(async (tx) => {
                const [maxAmt] = await this.getMaxPredictionForMatch({
                    num: input.matchNum,
                });
                let amt = input.amount * 2;
                if ((maxAmt ?? 0) > amt) amt = (maxAmt ?? 0) + 10;
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
            if (totalWon === 0) {
                return await this.settleAbandonedPredictions(input);
            }
            const totalLost =
                preds?.reduce(
                    (acc, r) =>
                        r.teamName !== input.winnerName && r.isDouble
                            ? acc + r.amount * 2
                            : r.teamName !== input.winnerName
                              ? acc + r.amount
                              : acc,
                    0
                ) ?? 0;
            const isDoubleWinner = !!preds?.find(
                (p) => p.isDouble && p.teamName === input.winnerName
            );

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
                              (isDoubleWinner || pred.isDouble)
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
            const isDoubleWinner = !!preds?.find(
                (p) => p.isDouble && p.teamName === input.winnerName
            );

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
                    pred.isDouble &&
                    (input.status === "abandoned" ||
                        (input.status === "completed" &&
                            pred.teamName === input.winnerName))
                        ? (pred.amount / totalWon) * totalLost + totalLost
                        : pred.status !== "default" &&
                            totalWon > 0 &&
                            totalLost > 0
                          ? (pred.amount / totalWon) * totalLost
                          : totalWon > 0 &&
                              totalLost > 0 &&
                              input.isDoublePlayed &&
                              (input.status === "abandoned" || isDoubleWinner)
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

    settleFinalPredictions = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [preds] = await this.getMatchPredictions({ num: 0 });

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
                    totalLost > 0
                        ? (pred.amount / totalWon) * totalLost
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

    reversePredictions = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [preds] = await this.getMatchPredictions({ num: input.num });

            preds?.forEach(async (pred: CompletePred) => {
                const status = pred.teamName ? "placed" : "default";
                if (pred.resultAmt !== 0)
                    await db
                        .update(profiles)
                        .set({
                            balance: sql`${profiles.balance}-${pred.resultAmt}`,
                        })
                        .where(eq(profiles.userId, pred.userId));

                await db
                    .update(predictions)
                    .set({ status, resultAmt: 0 })
                    .where(eq(predictions.id, pred.id));
            });
        });

    reverseFinalPredictions = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [preds] = await this.getMatchPredictions({ num: 0 });

            preds?.forEach(async (pred: CompletePred) => {
                if (pred.resultAmt !== 0)
                    await db
                        .update(profiles)
                        .set({
                            balance: sql`${profiles.balance}-${pred.resultAmt}`,
                        })
                        .where(eq(profiles.userId, pred.userId));

                await db
                    .update(predictions)
                    .set({ status: "placed", resultAmt: 0 })
                    .where(eq(predictions.id, pred.id));
            });
        });
}

export default new PredictionService();
