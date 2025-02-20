import { sql } from "drizzle-orm";
import {
    boolean,
    check,
    integer,
    pgEnum,
    pgTable,
    real,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { PRED_STATUS } from "@/lib/constants";
import { nanoid } from "@/lib/utils";

import { matches } from "./matches.schema";
import { profiles } from "./profiles.schema";
import { teamEnum, teams } from "./teams.schema";

export const predStatusEnum = pgEnum("prediction_status", PRED_STATUS);

export const predictions = pgTable(
    "predictions",
    {
        id: varchar("id", { length: 191 })
            .primaryKey()
            .$defaultFn(() => nanoid()),
        matchNum: integer("match_num")
            .references(() => matches.num, {
                onDelete: "cascade",
            })
            .notNull()
            .default(0),
        userId: varchar("user_id")
            .references(() => profiles.userId, {
                onDelete: "cascade",
            })
            .notNull(),
        teamName: teamEnum("team_name").references(() => teams.shortName, {
            onDelete: "cascade",
        }),
        status: predStatusEnum("status").notNull().default("placed"),
        isDouble: boolean("is_double").default(false).notNull(),
        isIPLWinner: boolean("is_ipl_winner").default(false).notNull(),
        isUpdated: boolean("is_updated").default(false).notNull(),
        amount: integer("amount").notNull(),
        resultAmt: real("result_amt").default(0).notNull(),
        createdAt: timestamp("created_at")
            .default(sql`now()`)
            .notNull(),
        updatedAt: timestamp("updated_at")
            .default(sql`now()`)
            .notNull(),
    },
    (predictions) => [
        uniqueIndex("pred_unique_idx").on(
            predictions.matchNum,
            predictions.userId
        ),
        check("amount_check", sql`${predictions.amount}>0`),
    ]
);

//zod schemas
const baseSchema = createSelectSchema(predictions);
export const insertPredSchema = createInsertSchema(predictions);
export const insertPredParams = baseSchema
    .extend({
        matchNum: z.coerce.number().optional(),
        amount: z.coerce.number(),
        resultAmt: z.coerce.number().optional(),
        isIPLWinner: z.boolean().optional(),
        isDouble: z.boolean().optional(),
        isUpdated: z.boolean().optional(),
        status: z.enum(PRED_STATUS).optional(),
    })
    .omit({
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
    })
    .superRefine((data, context) => {
        if (!data.isIPLWinner && !data.matchNum)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Match is required",
                path: ["matchNum"],
            });
    });
export const updatePredParams = baseSchema
    .extend({
        matchNum: z.coerce.number().optional(),
        amount: z.coerce.number(),
        resultAmt: z.coerce.number().optional(),
        isIPLWinner: z.boolean().optional(),
        isDouble: z.boolean().optional(),
        status: z.enum(PRED_STATUS).optional(),
    })
    .omit({
        userId: true,
        createdAt: true,
        updatedAt: true,
        isUpdated: true,
    })
    .superRefine((data, context) => {
        if (!data.isIPLWinner && !data.matchNum)
            return context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Match is required",
                path: ["matchNum"],
            });
    });

export const predIdSchema = baseSchema.pick({ id: true });
export const predStatusSchema = baseSchema.pick({ status: true });
export const predDoubleSchema = baseSchema.pick({
    id: true,
    matchNum: true,
    amount: true,
});
