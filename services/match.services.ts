import { and, eq, ne, or, sql } from "drizzle-orm";
import { z } from "zod";

import { createHistory, deleteHistory } from "@/actions/history.actions";
import {
    addDefaultPredictionsForMatch,
    reverseFinalPredictions,
    reversePredictions,
    settleAbandonedPredictions,
    settleCompletedPredictions,
    settleFinalPredictions,
} from "@/actions/prediction.actions";
import {
    reverseStatsForTeam1,
    reverseStatsForTeam2,
    updateStatsForTeam1,
    updateStatsForTeam2,
} from "@/actions/stats.actions";
import {
    reverseTeamsForCompletedMatch,
    updateTeamsForCompletedMatch,
} from "@/actions/team.actions";
import { getCurrUser } from "@/actions/user.actions";
import { Match, MatchWithTeams, TeamOption } from "@/app/types";
import {
    matchNumSchema,
    matchParams,
    matches,
} from "@/db/schema/matches.schema";
import { teamNameSchema, teams } from "@/db/schema/teams.schema";
import { protectedProcedure, publicProcedure } from "@/lib/zsa";

class MatchService {
    getAllMatches = publicProcedure
        .createServerAction()
        .input(z.object({ limit: z.coerce.number().optional() }))
        .handler(async ({ ctx: { db }, input: { limit } }) => {
            const rows = await db.query.matches.findMany({
                where: (matches, { ne }) => ne(matches.num, 0),
                extras: {
                    total: db
                        .$count(matches, and(ne(matches.num, 0)))
                        .as("total"),
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
                orderBy: (matches, { asc }) => [
                    asc(matches.date),
                    asc(matches.num),
                ],
            });
            return rows as MatchWithTeams[];
        });

    getAllFixtures = publicProcedure
        .createServerAction()
        .input(z.object({ limit: z.coerce.number().optional() }))
        .handler(async ({ ctx: { db }, input: { limit } }) => {
            const rows = await db.query.matches.findMany({
                limit: limit ?? 5,
                where: (matches, { eq, and, ne }) =>
                    and(ne(matches.num, 0), eq(matches.status, "scheduled")),
                extras: {
                    total: db
                        .$count(
                            matches,
                            and(
                                ne(matches.num, 0),
                                eq(matches.status, "scheduled")
                            )
                        )
                        .as("total"),
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
                orderBy: (matches, { asc }) => [
                    asc(matches.date),
                    asc(matches.num),
                ],
            });
            return rows as MatchWithTeams[];
        });

    getAllResults = publicProcedure
        .createServerAction()
        .input(z.object({ limit: z.coerce.number().optional() }))
        .handler(async ({ ctx: { db }, input: { limit } }) => {
            const rows = await db.query.matches.findMany({
                limit: limit ?? 5,
                where: (matches, { ne, and }) =>
                    and(ne(matches.num, 0), ne(matches.status, "scheduled")),
                extras: {
                    total: db
                        .$count(
                            matches,
                            and(
                                ne(matches.num, 0),
                                ne(matches.status, "scheduled")
                            )
                        )
                        .as("total"),
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
                orderBy: (matches, { desc }) => [
                    desc(matches.date),
                    desc(matches.num),
                ],
            });
            return rows as MatchWithTeams[];
        });

    getMatchByNum = publicProcedure
        .createServerAction()
        .input(matchNumSchema)
        .handler(async ({ ctx: { db }, input: { num } }) => {
            const row = await db.query.matches.findFirst({
                where: (matches, { eq }) => eq(matches.num, num),
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
            });
            return row as MatchWithTeams;
        });

    getMatchesByTeam = publicProcedure
        .createServerAction()
        .input(teamNameSchema)
        .handler(async ({ ctx: { db }, input: { shortName } }) => {
            const rows = await db.query.matches.findMany({
                where: (matches, { eq, or }) =>
                    or(
                        eq(matches.team1Name, shortName),
                        eq(matches.team2Name, shortName)
                    ),
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
                orderBy: (matches, { asc }) => [
                    asc(matches.date),
                    asc(matches.num),
                ],
            });

            return rows as MatchWithTeams[];
        });

    getTotalCompletedMatches = publicProcedure
        .createServerAction()
        .handler(async ({ ctx: { db } }) => {
            return await db.$count(
                matches,
                and(ne(matches.num, 0), ne(matches.status, "scheduled"))
            );
        });
    updateMatchTable = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db }, input }) => {
            const {
                status,
                winnerName,
                resultType,
                resultMargin,
                team1Runs,
                team1Wickets,
                team1Balls,
                team2Runs,
                team2Wickets,
                team2Balls,
            } = input;
            const [row] = await db
                .update(matches)
                .set({
                    status,
                    winnerName,
                    resultType,
                    resultMargin,
                    team1Runs,
                    team1Wickets,
                    team1Balls,
                    team2Runs,
                    team2Wickets,
                    team2Balls,
                })
                .where(eq(matches.num, input.num))
                .returning();
            return row as Match;
        });

    updateMatch = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [user] = await getCurrUser();
            if (!user?.isAdmin) throw "You are not authorized";
            const { winnerName, resultType, resultMargin } = input;

            await addDefaultPredictionsForMatch({
                date: input.date,
                num: input.num,
                minStake: input.minStake!,
            });

            const [match] = await this.updateMatchTable(input);
            if (!match) throw "Could not update Matches table";

            await db.transaction(async (tx) => {
                if (match.winnerName && match.status === "completed") {
                    await createHistory(input);
                    await updateStatsForTeam1({
                        ...match,
                        winnerName: match.winnerName ?? undefined,
                        resultType: match.resultType ?? undefined,
                        resultMargin: match.resultMargin ?? 0,
                    });
                    await updateStatsForTeam2({
                        ...match,
                        winnerName: match.winnerName ?? undefined,
                        resultType: match.resultType ?? undefined,
                        resultMargin: match.resultMargin ?? 0,
                    });

                    await settleCompletedPredictions({
                        ...match,
                        date: match?.date!,
                        winnerName: match.winnerName ?? undefined,
                        resultType: resultType ? resultType : undefined,
                        resultMargin: resultMargin ? resultMargin : 0,
                    });

                    if (match.type === "league")
                        await updateTeamsForCompletedMatch({
                            ...match,
                            date: match?.date!,
                            winnerName: match.winnerName ?? undefined,
                            resultType: resultType ? resultType : undefined,
                            resultMargin: resultMargin ? resultMargin : 0,
                        });
                    else if (match.type === "final")
                        await settleFinalPredictions({
                            ...match,
                            date: match?.date!,
                            winnerName: match.winnerName ?? undefined,
                            resultType: resultType ? resultType : undefined,
                            resultMargin: resultMargin ? resultMargin : 0,
                        });
                } else if (match.status === "abandoned") {
                    await settleAbandonedPredictions({
                        ...match,
                        date: match?.date!,
                        winnerName: match.winnerName ?? undefined,
                        resultType: resultType ? resultType : undefined,
                        resultMargin: resultMargin ? resultMargin : 0,
                    });
                    if (match.type === "final")
                        await settleFinalPredictions({
                            ...match,
                            date: match?.date!,
                            winnerName: match.winnerName ?? undefined,
                            resultType: resultType ? resultType : undefined,
                            resultMargin: resultMargin ? resultMargin : 0,
                        });
                    await tx
                        .update(teams)
                        .set({
                            played: sql`${teams.played}+1`,
                            points: sql`${teams.points}+1`,
                        })
                        .where(
                            or(
                                eq(
                                    teams.shortName,
                                    input.team1Name as TeamOption
                                ),
                                eq(
                                    teams.shortName,
                                    input.team2Name as TeamOption
                                )
                            )
                        );
                }
            });
            return match;
        });

    reverseMatch = protectedProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const [user] = await getCurrUser();
            if (!user?.isAdmin) throw "You are not authorized";
            const { winnerName, resultType, resultMargin } = input;

            return await db.transaction(async (tx) => {
                const [match] = await this.updateMatchTable({
                    ...input,
                    status: "scheduled",
                    winnerName: undefined,
                    resultType: undefined,
                    resultMargin: 0,
                });
                if (!match) throw "Could not reverse Matches table";
                if (winnerName) {
                    await deleteHistory(input);
                    await reverseStatsForTeam1(input);
                    await reverseStatsForTeam2(input);

                    await reversePredictions(input);

                    if (match.type === "league")
                        await reverseTeamsForCompletedMatch(input);
                    else if (match.type === "final")
                        await reverseFinalPredictions(input);
                } else if (input.status === "abandoned") {
                    await reversePredictions(input);
                    if (match.type === "final")
                        await reverseFinalPredictions(input);
                    await tx
                        .update(teams)
                        .set({
                            played: sql`${teams.played}-1`,
                            points: sql`${teams.points}-1`,
                        })
                        .where(
                            or(
                                eq(
                                    teams.shortName,
                                    input.team1Name as TeamOption
                                ),
                                eq(
                                    teams.shortName,
                                    input.team2Name as TeamOption
                                )
                            )
                        );
                }
                return match;
            });
        });
}

export default new MatchService();
