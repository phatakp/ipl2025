import { auth } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";

import { db } from "@/db";

export const publicProcedure = createServerActionProcedure().handler(
    async () => {
        return { db };
    }
);

export const protectedProcedure = createServerActionProcedure(
    publicProcedure
).handler(async ({ ctx }) => {
    try {
        const { db } = ctx;
        const { userId, sessionClaims } = await auth();
        if (!userId) throw new Error("User not authenticated");
        return {
            db,
            session: {
                user: {
                    id: userId,
                    firstName: sessionClaims?.firstName as string,
                    lastName: sessionClaims?.lastName as string,
                    email: sessionClaims?.email as string,
                    image: sessionClaims?.image as string,
                },
            },
        };
    } catch {
        throw new Error("User not authenticated");
    }
});
