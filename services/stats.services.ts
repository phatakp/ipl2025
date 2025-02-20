import { Stats } from "@/app/types";
import { matchTeamsSchema } from "@/db/schema/history.schema";
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
}

export default new StatsService();
