import { desc, eq, sql } from "drizzle-orm";

import { Team, TeamOption } from "@/app/types";
import { matchParams } from "@/db/schema/matches.schema";
import {
    teamLongNameSchema,
    teamNameSchema,
    teams,
} from "@/db/schema/teams.schema";
import { publicProcedure } from "@/lib/zsa";

class TeamService {
    getAllTeams = publicProcedure.createServerAction().handler(async () => {
        const rows = await db
            .select()
            .from(teams)
            .orderBy(desc(teams.points), desc(teams.nrr));
        return rows as Team[];
    });

    getTeamByName = publicProcedure
        .createServerAction()
        .input(teamNameSchema)
        .handler(async ({ ctx: { db }, input: { shortName } }) => {
            const [row] = await db
                .select()
                .from(teams)
                .where(eq(teams.shortName, shortName));
            return row as Team;
        });

    getTeamByLongName = publicProcedure
        .createServerAction()
        .input(teamLongNameSchema)
        .handler(async ({ ctx: { db }, input: { longName } }) => {
            const [row] = await db
                .select()
                .from(teams)
                .where(eq(teams.longName, longName));
            return row as Team;
        });

    updateTeamsForCompletedMatch = publicProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db }, input }) => {
            let [t1] = await db
                .select()
                .from(teams)
                .where(eq(teams.shortName, input.team1Name as TeamOption));
            let forRuns = (t1.forRuns ?? 0) + (input.team1Runs ?? 0);
            let forBalls = (t1.forBalls ?? 0) + (input.team1Balls ?? 0);
            let againstRuns = (t1.againstRuns ?? 0) + (input.team2Runs ?? 0);
            let againstBalls = (t1.againstBalls ?? 0) + (input.team2Balls ?? 0);
            let nrr = 6 * (forRuns / forBalls - againstRuns / againstBalls);

            await db
                .update(teams)
                .set({
                    played: sql`${teams.played}+1`,
                    won: sql`${teams.won}+${input.winnerName === input.team1Name ? 1 : 0}`,
                    lost: sql`${teams.lost}+${input.winnerName === input.team2Name ? 1 : 0}`,
                    points: sql`${teams.points}+${input.winnerName === input.team1Name ? 2 : input.winnerName === input.team2Name ? 0 : 1}`,
                    forRuns,
                    forBalls,
                    againstRuns,
                    againstBalls,
                    nrr,
                })
                .where(eq(teams.shortName, input.team1Name as TeamOption));

            let [t2] = await db
                .select()
                .from(teams)
                .where(eq(teams.shortName, input.team2Name as TeamOption));
            forRuns = (t2.forRuns ?? 0) + (input.team2Runs ?? 0);
            forBalls = (t2.forBalls ?? 0) + (input.team2Balls ?? 0);
            againstRuns = (t2.againstRuns ?? 0) + (input.team1Runs ?? 0);
            againstBalls = (t2.againstBalls ?? 0) + (input.team1Balls ?? 0);
            nrr = 6 * (forRuns / forBalls - againstRuns / againstBalls);

            await db
                .update(teams)
                .set({
                    played: sql`${teams.played}+1`,
                    won: sql`${teams.won}+${input.winnerName === input.team2Name ? 1 : 0}`,
                    lost: sql`${teams.lost}+${input.winnerName === input.team1Name ? 1 : 0}`,
                    points: sql`${teams.points}+${input.winnerName === input.team2Name ? 2 : input.winnerName === input.team1Name ? 0 : 1}`,
                    forRuns,
                    forBalls,
                    againstRuns,
                    againstBalls,
                    nrr,
                })
                .where(eq(teams.shortName, input.team2Name as TeamOption));
        });

    reverseTeamsForCompletedMatch = publicProcedure
        .createServerAction()
        .input(matchParams)
        .handler(async ({ ctx: { db }, input }) => {
            let [t1] = await db
                .select()
                .from(teams)
                .where(eq(teams.shortName, input.team1Name as TeamOption));
            let forRuns = (t1.forRuns ?? 0) - (input.team1Runs ?? 0);
            let forBalls = (t1.forBalls ?? 0) - (input.team1Balls ?? 0);
            let againstRuns = (t1.againstRuns ?? 0) - (input.team2Runs ?? 0);
            let againstBalls = (t1.againstBalls ?? 0) - (input.team2Balls ?? 0);
            let nrr = 6 * (forRuns / forBalls - againstRuns / againstBalls);

            await db
                .update(teams)
                .set({
                    played: sql`${teams.played}-1`,
                    won: sql`${teams.won}-${input.winnerName === input.team1Name ? 1 : 0}`,
                    lost: sql`${teams.lost}-${input.winnerName === input.team2Name ? 1 : 0}`,
                    points: sql`${teams.points}-${input.winnerName === input.team1Name ? 2 : input.winnerName === input.team2Name ? 0 : 1}`,
                    forRuns,
                    forBalls,
                    againstRuns,
                    againstBalls,
                    nrr,
                })
                .where(eq(teams.shortName, input.team1Name as TeamOption));

            let [t2] = await db
                .select()
                .from(teams)
                .where(eq(teams.shortName, input.team2Name as TeamOption));
            forRuns = (t2.forRuns ?? 0) - (input.team2Runs ?? 0);
            forBalls = (t2.forBalls ?? 0) - (input.team2Balls ?? 0);
            againstRuns = (t2.againstRuns ?? 0) - (input.team1Runs ?? 0);
            againstBalls = (t2.againstBalls ?? 0) - (input.team1Balls ?? 0);
            nrr = 6 * (forRuns / forBalls - againstRuns / againstBalls);

            await db
                .update(teams)
                .set({
                    played: sql`${teams.played}-1`,
                    won: sql`${teams.won}-${input.winnerName === input.team2Name ? 1 : 0}`,
                    lost: sql`${teams.lost}-${input.winnerName === input.team1Name ? 1 : 0}`,
                    points: sql`${teams.points}-${input.winnerName === input.team2Name ? 2 : input.winnerName === input.team1Name ? 0 : 1}`,
                    forRuns,
                    forBalls,
                    againstRuns,
                    againstBalls,
                    nrr,
                })
                .where(eq(teams.shortName, input.team2Name as TeamOption));
        });
}

export default new TeamService();
