import { and, eq, max, sql } from "drizzle-orm";

import { CompletePred, Pred } from "@/app/types";
import {
    matchDefaultSchema,
    matchNumSchema,
    matches,
} from "@/db/schema/matches.schema";
import {
    insertPredParams,
    predDoubleSchema,
    predictions,
    updatePredParams,
} from "@/db/schema/predictions.schema";
import { profiles } from "@/db/schema/profiles.schema";
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
                        columns: {
                            minStake: true,
                            team1Name: true,
                            team2Name: true,
                        },
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
                        columns: {
                            minStake: true,
                            team1Name: true,
                            team2Name: true,
                        },
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
                        columns: {
                            minStake: true,
                            team1Name: true,
                            team2Name: true,
                        },
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

    addDefaultPredictionForMatch = protectedProcedure
        .createServerAction()
        .input(matchDefaultSchema)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [row] = await db
                .insert(predictions)
                .values({
                    ...input,
                    matchNum: input.num,
                    userId: session.user.id,
                    amount: input.minStake,
                    status: "default",
                })
                .returning();
            return row as Pred;
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
}

export default new PredictionService();
