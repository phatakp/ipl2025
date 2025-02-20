import { NeonQueryFunction, neon } from "@neondatabase/serverless";
import { NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import {
    drizzle as PostgresDrizzle,
    PostgresJsDatabase,
} from "drizzle-orm/postgres-js";

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

let db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;
if (env.NODE_ENV === "production") {
    const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);
    db = drizzle(sql, { schema });
} else {
    db = PostgresDrizzle(env.DATABASE_URL, { schema });
}
export { db };
