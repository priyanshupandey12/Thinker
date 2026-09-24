import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "../../config/config";
import * as schema from "./schema";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: config.nodeEnv === "test" ? 4 : 10,
});

export const database = drizzle(pool, { schema });
