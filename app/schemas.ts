import { z } from "zod";

export const newProfileParams = z.object({
    userId: z.string().optional(),
    email: z.string().email(),
    name: z.string(),
    imageUrl: z.string().url().nullable().optional(),
    teamId: z.string(),
    balance: z.coerce.number().nullable().optional(),
    doublesLeft: z.coerce.number().nullable().optional(),
    isAdmin: z.boolean().nullable().optional(),
    isPaid: z.boolean().nullable().optional(),
});
