import { createApp } from "../app";
import { config } from "../config/config";
import { pool } from "../infrastructure/database/client";
import { logger } from "../infrastructure/logging/logger";

const app = createApp();
const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, "Thinker API is listening");
});

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down Thinker API");
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
