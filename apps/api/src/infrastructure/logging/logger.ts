import pino from "pino";
import { config } from "../../config/config";

export const logger = pino({
  level: config.logLevel,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.secret"],
    censor: "[redacted]",
  },
});
