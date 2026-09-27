import pino from "pino";
import { config } from "../../config/config";

export const logger = pino({
  level: config.logLevel,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
      "res.headers.location",
      "*.password",
      "*.secret",
    ],
    censor: "[redacted]",
  },
});
