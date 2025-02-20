import { desc, eq } from "drizzle-orm";

import { Team } from "@/app/types";
import {
    teamLongNameSchema,
    teamNameSchema,
    teams,
} from "@/db/schema/teams.schema";
import { publicProcedure } from "@/lib/zsa";

class TeamService {
    getAllTeams = publicProcedure
        .createServerAction()
        .handler(async ({ ctx: { db } }) => {
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
}

export default new TeamService();
