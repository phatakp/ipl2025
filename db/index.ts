import { Client, neonConfig } from "@neondatabase/serverless";
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

let db: Client | PostgresJsDatabase<typeof schema>;
if (env.NODE_ENV === "production") {
    neonConfig.webSocketConstructor = ws;
    db = new Client({ connectionString: env.DATABASE_URL });
} else {
    db = PostgresDrizzle(env.DATABASE_URL, { schema });
}
export { db };
