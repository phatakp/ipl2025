import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { MATCH_RESULT_TYPE, MATCH_STATUS, TEAMS } from "@/lib/constants";

import { teamEnum, teams } from "./teams.schema";

export const matchStatusEnum = pgEnum("match_status", MATCH_STATUS);

export const matchResultTypeEnum = pgEnum(
    "match_result_type",
    MATCH_RESULT_TYPE
);

export const matchTypeEnum = pgEnum("match_type", [
    "league",
    "qualifier1",
    "qualifier2",
    "eliminator",
    "final",
]);

export const matches = pgTable(
    "matches",
    {
        num: integer("num").primaryKey().notNull().default(0),
        date: timestamp("date", {
            mode: "string",
            withTimezone: true,
        }).notNull(),
        team1Name: teamEnum("team1_name").references(() => teams.shortName, {
            onDelete: "cascade",
        }),
        team2Name: teamEnum("team2_name").references(() => teams.shortName, {
            onDelete: "cascade",
        }),
        winnerName: teamEnum("winner_name").references(() => teams.shortName, {
            onDelete: "cascade",
        }),
        status: matchStatusEnum("status").notNull().default("scheduled"),
        type: matchTypeEnum("type").notNull().default("league"),
        resultType: matchResultTypeEnum("result_type"),
        resultMargin: integer("result_margin"),
        venue: varchar("venue", { length: 191 }).notNull(),
        isDoublePlayed: boolean("is_double_played").default(false).notNull(),
        minStake: integer("min_stake").default(30).notNull(),
        team1Runs: integer("team1_runs").default(0).notNull(),
        team1Wickets: integer("team1_wickets").default(0).notNull(),
        team1Balls: integer("team1_balls").default(0).notNull(),
        team2Runs: integer("team2_runs").default(0).notNull(),
        team2Wickets: integer("team2_wickets").default(0).notNull(),
        team2Balls: integer("team2_balls").default(0).notNull(),
    },
    (matches) => {
        return {
            matchIndex: uniqueIndex("match_unique_idx").on(
                matches.team1Name,
                matches.team2Name,
                matches.date
            ),
        };
    }
);

//zod schemas
const baseSchema = createSelectSchema(matches);
export const insertMatchSchema = createInsertSchema(matches);
export const matchParams = baseSchema.extend({
    num: z.coerce.number(),
    minStake: z.coerce.number().optional(),
    resultMargin: z.coerce.number().optional(),
    winnerName: z.enum(TEAMS).optional(),
    status: z.enum(MATCH_STATUS).optional(),
    resultType: z.enum(MATCH_RESULT_TYPE).optional(),
    team1Runs: z.coerce.number().optional(),
    team1Wickets: z.coerce.number().optional(),
    team1Balls: z.coerce.number().optional(),
    team2Runs: z.coerce.number().optional(),
    team2Wickets: z.coerce.number().optional(),
    team2Balls: z.coerce.number().optional(),
    isDoublePlayed: z.boolean().optional(),
});
export const matchNumSchema = baseSchema.pick({ num: true });
export const matchStatsSchema = baseSchema.pick({ num: true, status: true });
export const matchDefaultSchema = baseSchema.pick({
    num: true,
    minStake: true,
    date: true,
});
export const matchStatusSchema = baseSchema.pick({ status: true });
export const matchTypeSchema = baseSchema.pick({ type: true });
export const matchResultTypeSchema = baseSchema.pick({ resultType: true });
