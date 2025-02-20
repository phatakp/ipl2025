import { and, eq } from "drizzle-orm";

import { Profile, ProfileWithTeam } from "@/app/types";
import { predictions } from "@/db/schema/predictions.schema";
import { profileParams, profiles } from "@/db/schema/profiles.schema";
import { protectedProcedure } from "@/lib/zsa";

class UserService {
    getAllUsers = protectedProcedure
        .createServerAction()
        .handler(async ({ ctx: { db } }) => {
            const rows = await db.query.profiles.findMany({
                with: {
                    team: {
                        columns: { longName: true },
                    },
                },
                orderBy: (profiles, { desc }) => [desc(profiles.balance)],
            });
            return rows as ProfileWithTeam[];
        });

    getRank = protectedProcedure
        .createServerAction()
        .handler(async ({ ctx: { db, session } }) => {
            const rows = await db.query.profiles.findMany({
                orderBy: (profiles, { desc }) => [desc(profiles.balance)],
            });
            const rank = rows.findIndex((r) => r.userId === session.user.id);
            return rank + 1;
        });

    getCurrUser = protectedProcedure
        .createServerAction()
        .handler(async ({ ctx: { db, session } }) => {
            const row = await db.query.profiles.findFirst({
                where: (profiles, { eq }) =>
                    eq(profiles.userId, session.user.id),
                with: {
                    team: {
                        columns: { longName: true },
                    },
                },
            });
            return row as ProfileWithTeam;
        });

    createProfile = protectedProcedure
        .createServerAction()
        .input(profileParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const profile = await db.transaction(async (tx) => {
                const [row] = await tx
                    .insert(profiles)
                    .values({ ...input, userId: session.user.id })
                    .returning();

                if (row) {
                    await tx.insert(predictions).values({
                        teamName: row.teamName,
                        amount: 500,
                        userId: row.userId,
                        isIPLWinner: true,
                    });
                }
                return row;
            });

            return profile as Profile;
        });

    updateProfile = protectedProcedure
        .createServerAction()
        .input(profileParams)
        .handler(async ({ ctx: { db, session }, input }) => {
            const { email, ...values } = input;
            const profile = await db.transaction(async (tx) => {
                const prof = await tx.query.profiles.findFirst({
                    where: (profiles, { eq }) =>
                        eq(profiles.userId, session.user.id),
                });

                const [row] = await tx
                    .update(profiles)
                    .set(values)
                    .where(eq(profiles.userId, session.user.id))
                    .returning();

                if (prof?.teamName !== input.teamName) {
                    await tx
                        .update(predictions)
                        .set({
                            teamName: input.teamName,
                        })
                        .where(
                            and(
                                eq(predictions.userId, session.user.id),
                                eq(predictions.matchNum, 0)
                            )
                        );
                }
                return row;
            });

            return profile as Profile;
        });
}

export default new UserService();
