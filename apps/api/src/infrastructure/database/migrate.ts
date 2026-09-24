import { migrate } from "drizzle-orm/node-postgres/migrator";
import { database, pool } from "./client";

await migrate(database, { migrationsFolder: "./drizzle" });
await pool.end();
