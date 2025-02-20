import { asc, isNotNull, sql } from "drizzle-orm";

import { HistTotalsReturn, MatchHistWithTeams } from "@/app/types";
import { matchHistory, matchTeamsSchema } from "@/db/schema/history.schema";
import { teamNameSchema } from "@/db/schema/teams.schema";
import { publicProcedure } from "@/lib/zsa";

class HistoryService {
    getAllHistory = publicProcedure
        .createServerAction()
        .handler(async ({ ctx: { db } }) => {
            const rows = await db.query.matchHistory.findMany({
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
            return rows as MatchHistWithTeams[];
        });

    getRecentMatchesForTeam = publicProcedure
        .createServerAction()
        .input(teamNameSchema)
        .handler(async ({ ctx: { db }, input: { shortName } }) => {
            const rows = await db.query.matchHistory.findMany({
                limit: 5,
                where: (history, { eq, or }) =>
                    or(
                        eq(history.team1Name, shortName),
                        eq(history.team2Name, shortName)
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
                orderBy: (history, { desc }) => [desc(history.date)],
            });
            return rows as MatchHistWithTeams[];
        });

    getRecentHeadToHead = publicProcedure
        .createServerAction()
        .input(matchTeamsSchema)
        .handler(async ({ ctx: { db }, input: { team1Name, team2Name } }) => {
            const rows = await db.query.matchHistory.findMany({
                limit: 5,
                where: (history, { eq, or, and }) =>
                    or(
                        and(
                            eq(history.team1Name, team1Name),
                            eq(history.team2Name, team2Name)
                        ),
                        and(
                            eq(history.team1Name, team2Name),
                            eq(history.team2Name, team1Name)
                        )
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
                orderBy: (history, { desc }) => [desc(history.date)],
            });
            return rows as MatchHistWithTeams[];
        });

    getTotals = publicProcedure
        .createServerAction()

        .handler(async ({ ctx: { db } }) => {
            const rows = await db
                .select({
                    team1: matchHistory.team1Name,
                    team2: matchHistory.team2Name,
                    winner: matchHistory.winnerName,
                    type: matchHistory.resultType,
                    count: sql<number>`cast(count(${matchHistory.team1Name}) as int)`,
                })
                .from(matchHistory)
                .where(isNotNull(matchHistory.winnerName))
                .groupBy(
                    matchHistory.team1Name,
                    matchHistory.team2Name,
                    matchHistory.winnerName,
                    matchHistory.resultType
                )
                .orderBy(
                    asc(matchHistory.team1Name),
                    asc(matchHistory.team2Name),
                    asc(matchHistory.winnerName),
                    asc(matchHistory.resultType)
                );
            return rows as HistTotalsReturn[];
        });

    getHomePlayed = publicProcedure
        .createServerAction()
        .handler(async ({ ctx: { db } }) => {
            const rows = await db
                .select({
                    team1: matchHistory.team1Name,
                    count: sql<number>`cast(count(${matchHistory.team1Name}) as int)`,
                })
                .from(matchHistory)
                .where(isNotNull(matchHistory.winnerName))
                .groupBy(matchHistory.team1Name);

            return rows as Pick<HistTotalsReturn, "team1" | "count">[];
        });

    getAwayPlayed = publicProcedure
        .createServerAction()
        .handler(async ({ ctx: { db } }) => {
            const rows = await db
                .select({
                    team2: matchHistory.team2Name,
                    count: sql<number>`cast(count(${matchHistory.team2Name}) as int)`,
                })
                .from(matchHistory)
                .where(isNotNull(matchHistory.winnerName))
                .groupBy(matchHistory.team2Name);

            return rows as Pick<HistTotalsReturn, "team2" | "count">[];
        });
}

export default new HistoryService();
