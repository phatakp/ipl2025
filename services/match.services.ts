import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { MatchWithTeams } from "@/app/types";
import { matchNumSchema, matches } from "@/db/schema/matches.schema";
import { teamNameSchema } from "@/db/schema/teams.schema";
import { publicProcedure } from "@/lib/zsa";

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
}

export default new MatchService();
