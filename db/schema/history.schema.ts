import {
    boolean,
    integer,
    pgTable,
    primaryKey,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { matchResultTypeEnum } from "./matches.schema";
import { teamEnum, teams } from "./teams.schema";

export const matchHistory = pgTable(
    "match_history",
    {
        date: timestamp("date", {
            mode: "string",
        }).notNull(),
        team1Name: teamEnum("team1_name")
            .references(() => teams.shortName, {
                onDelete: "cascade",
            })
            .notNull(),
        team2Name: teamEnum("team2_name")
            .references(() => teams.shortName, {
                onDelete: "cascade",
            })
            .notNull(),
        winnerName: teamEnum("winner_Name").references(() => teams.shortName, {
            onDelete: "cascade",
        }),
        venue: varchar("venue", { length: 191 }).notNull(),
        resultMargin: integer("result_margin"),
        resultType: matchResultTypeEnum("result_type"),
        team1Runs: integer("team1_runs").default(0).notNull(),
        team1Balls: integer("team1_balls").default(0).notNull(),
        team2Runs: integer("team2_runs").default(0).notNull(),
        team2Balls: integer("team2_balls").default(0).notNull(),
        isLeagueMatch: boolean("is_league_match").default(true).notNull(),
    },
    (history) => {
        return {
            id: primaryKey({
                name: "history_id",
                columns: [history.team1Name, history.team2Name, history.date],
            }),
        };
    }
);

// zod schemas
const baseSchema = createSelectSchema(matchHistory);

export const insertMatchHistSchema = createInsertSchema(matchHistory);
export const historyParams = baseSchema.extend({
    team1Runs: z.coerce.number().optional(),
    team1Balls: z.coerce.number().optional(),
    team2Runs: z.coerce.number().optional(),
    team2Balls: z.coerce.number().optional(),
});
export const matchTeamsSchema = baseSchema.pick({
    team1Name: true,
    team2Name: true,
});
