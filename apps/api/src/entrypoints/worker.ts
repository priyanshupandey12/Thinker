import { pool } from "../infrastructure/database/client";
import { logger } from "../infrastructure/logging/logger";

logger.info("Thinker worker scaffold is ready; no job handlers are registered yet.");

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down Thinker worker");
  await pool.end();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
