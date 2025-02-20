import { integer, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { nanoid } from "@/lib/utils";

import { teamEnum } from "./teams.schema";

export const stats = pgTable(
    "stats",
    {
        id: varchar("id", { length: 191 })
            .primaryKey()
            .$defaultFn(() => nanoid()),
        team1Name: teamEnum("team1_name").notNull(),
        team2Name: teamEnum("team2_name"),
        played: integer("played").default(0).notNull(),
        won: integer("won").default(0).notNull(),
        lost: integer("lost").default(0).notNull(),
        homePlayed: integer("home_played").default(0).notNull(),
        homeWon: integer("home_won").default(0).notNull(),
        awayPlayed: integer("away_played").default(0).notNull(),
        awayWon: integer("away_won").default(0).notNull(),
        batFirstPlayed: integer("bat_first_played").default(0).notNull(),
        batFirstWon: integer("bat_first_won").default(0).notNull(),
        batSecondPlayed: integer("bat_second_played").default(0).notNull(),
        batSecondWon: integer("bat_second_won").default(0).notNull(),
    },
    (stats) => {
        return {
            statsIndex: uniqueIndex("stats_unique_idx").on(
                stats.team1Name,
                stats.team2Name
            ),
        };
    }
);

// zod schemas
const baseSchema = createSelectSchema(stats);

export const insertStatsSchema = createInsertSchema(stats);

export const updateStatsSchema = baseSchema;
