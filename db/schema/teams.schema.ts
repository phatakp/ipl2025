import {
    index,
    integer,
    pgEnum,
    pgTable,
    real,
    text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { TEAMS } from "@/lib/constants";

export const teamEnum = pgEnum("team_enum", TEAMS);

export const teams = pgTable(
    "teams",
    {
        shortName: teamEnum("short_name").primaryKey().notNull(),
        longName: text("long_name").notNull().unique(),
        played: integer("played").default(0).notNull(),
        won: integer("won").default(0).notNull(),
        lost: integer("lost").default(0).notNull(),
        points: integer("points").default(0).notNull(),
        nrr: real("nrr").default(0.0).notNull(),
        forRuns: integer("for_runs").default(0).notNull(),
        forBalls: integer("for_balls").default(0).notNull(),
        againstRuns: integer("against_runs").default(0).notNull(),
        againstBalls: integer("against_balls").default(0).notNull(),
    },
    (teams) => {
        return {
            teamIndex: index("team_name_idx").on(teams.longName),
        };
    }
);

// zod schemas
const baseSchema = createSelectSchema(teams);
const insertTeamSchema = createInsertSchema(teams);
export const teamParams = baseSchema.extend({
    played: z.coerce.number().optional(),
    won: z.coerce.number().optional(),
    lost: z.coerce.number().optional(),
    points: z.coerce.number().optional(),
    nrr: z.coerce.number().optional(),
    forRuns: z.coerce.number().optional(),
    forBalls: z.coerce.number().optional(),
    againstRuns: z.coerce.number().optional(),
    againstBalls: z.coerce.number().optional(),
});
export const teamNameSchema = baseSchema.pick({ shortName: true });
export const teamLongNameSchema = baseSchema.pick({ longName: true });
export const shortTeamSchema = baseSchema.pick({
    longName: true,
});
