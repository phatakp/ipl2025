import { loadEnvConfig } from "@next/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export const env = createEnv({
    server: {
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        DATABASE_URL: z.string().min(1),
        CLERK_SECRET_KEY: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1), // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
            process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
            process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    },
});
