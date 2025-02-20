import "dotenv/config";
import type { Config } from "drizzle-kit";

import { env } from "@/lib/env";

export default {
    schema: "./db/schema",
    dialect: "postgresql",
    out: "./db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
} satisfies Config;
