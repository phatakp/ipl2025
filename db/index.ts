import { Pool, neonConfig } from "@neondatabase/serverless";
import { NeonDatabase, drizzle } from "drizzle-orm/neon-serverless";
import {
    drizzle as PostgresDrizzle,
    PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import ws from "ws";

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
declare global {
    // eslint-disable-next-line no-var
    var db: NeonDatabase<typeof schema> | PostgresJsDatabase<typeof schema>; // <- Name it whatever you want, except "prisma".
}

let db: NeonDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;
if (env.NODE_ENV === "production") {
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
} else {
    if (!global.db) global.db = PostgresDrizzle(env.DATABASE_URL, { schema });
    db = global.db;
}
export { db };
