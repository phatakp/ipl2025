import { NeonQueryFunction, neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle as PostgresDrizzle } from "drizzle-orm/postgres-js";
import { migrate as PostgresMigrate } from "drizzle-orm/postgres-js/migrator";

import * as matchHist from "@/db/schema/history.schema";
import * as matches from "@/db/schema/matches.schema";
import * as predictions from "@/db/schema/predictions.schema";
import * as profiles from "@/db/schema/profiles.schema";
import * as relations from "@/db/schema/relations";
import * as stats from "@/db/schema/stats.schema";
import * as teams from "@/db/schema/teams.schema";
import { env } from "@/lib/env";

const schema = {
    ...teams,
    ...profiles,
    ...matches,
    ...predictions,
    ...matchHist,
    ...stats,
    ...relations,
};

const runMigrate = async () => {
    if (!env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }
    const start = Date.now();

    // let db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;
    if (env.NODE_ENV === "production") {
        const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);
        const db = drizzle(sql, { schema });
        await migrate(db, { migrationsFolder: "db/migrations" });
    } else {
        const db = PostgresDrizzle(env.DATABASE_URL, { schema });
        await PostgresMigrate(db, {
            migrationsFolder: "db/migrations",
        });
    }

    console.log("⏳ Running migrations...");

    const end = Date.now();

    console.log("✅ Migrations completed in", end - start, "ms");

    process.exit(0);
};

runMigrate().catch((err) => {
    console.error("❌ Migration failed");
    console.error(err);
    process.exit(1);
});
