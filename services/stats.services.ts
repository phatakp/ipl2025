import { and, eq, isNull, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

import { Stats } from "@/app/types";
import { matchTeamsSchema } from "@/db/schema/history.schema";
import { matchParams, matches } from "@/db/schema/matches.schema";
import { stats } from "@/db/schema/stats.schema";
import { publicProcedure } from "@/lib/zsa";

class StatsService {
    getStatsForTeams = publicProcedure
        .createServerAction()
        .input(matchTeamsSchema)
        .handler(async ({ ctx: { db }, input: { team1Name, team2Name } }) => {
            const rows = await db.query.stats.findMany({
                where: (stats, { or, and, eq, isNull }) =>
                    or(
                        and(
                            eq(stats.team1Name, team1Name),
                            isNull(stats.team2Name)
                        ),
                        and(
                            eq(stats.team1Name, team2Name),
                            isNull(stats.team2Name)
                        ),
                        and(
                            eq(stats.team1Name, team1Name),
                            eq(stats.team2Name, team2Name)
                        ),
                        and(
                            eq(stats.team1Name, team2Name),
                            eq(stats.team2Name, team1Name)
                        )
                    ),

                orderBy: (stats, { asc }) => [
                    asc(stats.team1Name),
                    asc(stats.team2Name),
                ],
            });
            return rows as Stats[];
        });

    updateStatsForTeam1 = publicProcedure
        .createServerAction()
        .input(createSelectSchema(matches))
        .handler(async ({ ctx: { db }, input }) => {
            const { winnerName, resultType } = input;

            let batFirstPlayed =
                (resultType === "runs" && winnerName === input.team1Name) ||
                (resultType === "wickets" && winnerName === input.team2Name)
                    ? 1
                    : 0;
            let batFirstWon =
                resultType === "runs" && winnerName === input.team1Name ? 1 : 0;
            let batSecondPlayed =
                (resultType === "wickets" && winnerName === input.team1Name) ||
                (resultType === "runs" && winnerName === input.team2Name)
                    ? 1
                    : 0;
            let batSecondWon =
                resultType === "wickets" && winnerName === input.team1Name
                    ? 1
                    : 0;

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} + 1`,
                    won: sql`${stats.won} + ${input.team1Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} + ${input.team1Name === winnerName ? 0 : 1}`,
                    homePlayed: sql`${stats.homePlayed} + 1`,
                    homeWon: sql`${stats.homeWon} + ${input.team1Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} + ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} + ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} + ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} + ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team1Name!),
                        isNull(stats.team2Name)
                    )
                );

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} + 1`,
                    won: sql`${stats.won} + ${input.team1Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} + ${input.team1Name === winnerName ? 0 : 1}`,
                    homePlayed: sql`${stats.homePlayed} + 1`,
                    homeWon: sql`${stats.homeWon} + ${input.team1Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} + ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} + ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} + ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} + ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team1Name!),
                        eq(stats.team2Name, input.team2Name!)
                    )
                );
        });

    updateStatsForTeam2 = publicProcedure
        .createServerAction()
        .input(createSelectSchema(matches))
        .handler(async ({ ctx: { db }, input }) => {
            const { winnerName, resultType } = input;

            let batFirstPlayed =
                (resultType === "runs" && winnerName === input.team2Name) ||
                (resultType === "wickets" && winnerName === input.team1Name)
                    ? 1
                    : 0;
            let batFirstWon =
                resultType === "runs" && winnerName === input.team2Name ? 1 : 0;
            let batSecondPlayed =
                (resultType === "wickets" && winnerName === input.team2Name) ||
                (resultType === "runs" && winnerName === input.team1Name)
                    ? 1
                    : 0;
            let batSecondWon =
                resultType === "wickets" && winnerName === input.team2Name
                    ? 1
                    : 0;

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} + 1`,
                    won: sql`${stats.won} + ${input.team1Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} + ${input.team1Name === winnerName ? 0 : 1}`,
                    homePlayed: sql`${stats.homePlayed} + 1`,
                    homeWon: sql`${stats.homeWon} + ${input.team1Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} + ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} + ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} + ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} + ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team1Name!),
                        isNull(stats.team2Name)
                    )
                );

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} + 1`,
                    won: sql`${stats.won} + ${input.team2Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} + ${input.team2Name === winnerName ? 0 : 1}`,
                    awayPlayed: sql`${stats.awayPlayed} + 1`,
                    awayWon: sql`${stats.awayWon} + ${input.team2Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} + ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} + ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} + ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} + ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team2Name!),
                        eq(stats.team2Name, input.team1Name!)
                    )
                );
        });

    reverseStatsForTeam1 = publicProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db }, input }) => {
            const { winnerName, resultType } = input;

            let batFirstPlayed =
                (resultType === "runs" && winnerName === input.team1Name) ||
                (resultType === "wickets" && winnerName === input.team2Name)
                    ? 1
                    : 0;
            let batFirstWon =
                resultType === "runs" && winnerName === input.team1Name ? 1 : 0;
            let batSecondPlayed =
                (resultType === "wickets" && winnerName === input.team1Name) ||
                (resultType === "runs" && winnerName === input.team2Name)
                    ? 1
                    : 0;
            let batSecondWon =
                resultType === "wickets" && winnerName === input.team1Name
                    ? 1
                    : 0;

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} - 1`,
                    won: sql`${stats.won} - ${input.team1Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} - ${input.team1Name === winnerName ? 0 : 1}`,
                    homePlayed: sql`${stats.homePlayed} - 1`,
                    homeWon: sql`${stats.homeWon} - ${input.team1Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} - ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} - ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} - ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} - ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team1Name!),
                        isNull(stats.team2Name)
                    )
                );

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} - 1`,
                    won: sql`${stats.won} - ${input.team1Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} - ${input.team1Name === winnerName ? 0 : 1}`,
                    homePlayed: sql`${stats.homePlayed} - 1`,
                    homeWon: sql`${stats.homeWon} - ${input.team1Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} - ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} - ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} - ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} - ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team1Name!),
                        eq(stats.team2Name, input.team2Name!)
                    )
                );
        });

    reverseStatsForTeam2 = publicProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db }, input }) => {
            const { winnerName, resultType } = input;

            let batFirstPlayed =
                (resultType === "runs" && winnerName === input.team2Name) ||
                (resultType === "wickets" && winnerName === input.team1Name)
                    ? 1
                    : 0;
            let batFirstWon =
                resultType === "runs" && winnerName === input.team2Name ? 1 : 0;
            let batSecondPlayed =
                (resultType === "wickets" && winnerName === input.team2Name) ||
                (resultType === "runs" && winnerName === input.team1Name)
                    ? 1
                    : 0;
            let batSecondWon =
                resultType === "wickets" && winnerName === input.team2Name
                    ? 1
                    : 0;

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} - 1`,
                    won: sql`${stats.won} - ${input.team1Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} - ${input.team1Name === winnerName ? 0 : 1}`,
                    homePlayed: sql`${stats.homePlayed} - 1`,
                    homeWon: sql`${stats.homeWon} - ${input.team1Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} - ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} - ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} - ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} - ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team1Name!),
                        isNull(stats.team2Name)
                    )
                );

            await db
                .update(stats)
                .set({
                    played: sql`${stats.played} - 1`,
                    won: sql`${stats.won} - ${input.team2Name === winnerName ? 1 : 0}`,
                    lost: sql`${stats.lost} - ${input.team2Name === winnerName ? 0 : 1}`,
                    awayPlayed: sql`${stats.awayPlayed} - 1`,
                    awayWon: sql`${stats.awayWon} - ${input.team2Name === winnerName ? 1 : 0}`,
                    batFirstPlayed: sql`${stats.batFirstPlayed} - ${batFirstPlayed}`,
                    batFirstWon: sql`${stats.batFirstWon} - ${batFirstWon}`,
                    batSecondPlayed: sql`${stats.batSecondPlayed} - ${batSecondPlayed}`,
                    batSecondWon: sql`${stats.batSecondWon} - ${batSecondWon}`,
                })
                .where(
                    and(
                        eq(stats.team1Name, input.team2Name!),
                        eq(stats.team2Name, input.team1Name!)
                    )
                );
        });
}

export default new StatsService();
