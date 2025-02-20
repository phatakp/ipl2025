import { sql } from "drizzle-orm";
import {
    boolean,
    check,
    index,
    integer,
    pgTable,
    real,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { teamEnum, teams } from "./teams.schema";

export const profiles = pgTable(
    "profiles",
    {
        userId: varchar("user_id", { length: 256 }).primaryKey(),
        email: text("email").unique().notNull(),
        imageUrl: text("image_url"),
        firstName: varchar("first_name", { length: 256 }).notNull(),
        lastName: varchar("last_name", { length: 256 }),
        balance: real("balance").default(0).notNull(),
        doublesLeft: integer("doubles_left").default(5).notNull(),
        isAdmin: boolean("is_admin").default(false).notNull(),
        isPaid: boolean("is_paid").default(false).notNull(),
        teamName: teamEnum("team_name").references(() => teams.shortName, {
            onDelete: "set null",
        }),

        createdAt: timestamp("created_at")
            .default(sql`now()`)
            .notNull(),
        updatedAt: timestamp("updated_at")
            .default(sql`now()`)
            .notNull(),
    },
    (profiles) => [
        index("profile_balance_idx").on(profiles.balance),
        check("doubles_check", sql`${profiles.doublesLeft}>=0`),
    ]
);

//zod schemas
const baseSchema = createSelectSchema(profiles).omit(timestamps);
export const insertProfileSchema =
    createInsertSchema(profiles).omit(timestamps);
export const profileParams = baseSchema
    .extend({
        imageUrl: z.string().optional(),
        balance: z.coerce.number().optional(),
        doublesLeft: z.coerce.number().optional(),
        isAdmin: z.coerce.boolean().optional(),
        isPaid: z.coerce.boolean().optional(),
    })
    .omit({
        userId: true,
    });

export const shortProfileSchema = baseSchema.pick({
    userId: true,
    firstName: true,
    lastName: true,
    imageUrl: true,
});
export const profileIdSchema = baseSchema.pick({ userId: true });
