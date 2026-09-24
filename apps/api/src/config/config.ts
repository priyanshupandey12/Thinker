import { z } from "zod";

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65_535).default(3000),
  APP_ORIGIN: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().url().default("postgresql://thinker:12345678@localhost:5432/thinker"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  BETTER_AUTH_SECRET: optionalNonEmptyString,
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  GITHUB_CLIENT_ID: optionalNonEmptyString,
  GITHUB_CLIENT_SECRET: optionalNonEmptyString,
  OPENROUTER_API_KEY: optionalNonEmptyString,
  OPENROUTER_MODEL: optionalNonEmptyString,
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  console.error("Invalid environment configuration", parsedConfig.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration.");
}

export const config = {
  nodeEnv: parsedConfig.data.NODE_ENV,
  port: parsedConfig.data.PORT,
  appOrigin: parsedConfig.data.APP_ORIGIN,
  databaseUrl: parsedConfig.data.DATABASE_URL,
  logLevel: parsedConfig.data.LOG_LEVEL,
  auth: {
    secret: parsedConfig.data.BETTER_AUTH_SECRET,
    baseUrl: parsedConfig.data.BETTER_AUTH_URL,
    githubClientId: parsedConfig.data.GITHUB_CLIENT_ID,
    githubClientSecret: parsedConfig.data.GITHUB_CLIENT_SECRET,
  },
  mentor: {
    apiKey: parsedConfig.data.OPENROUTER_API_KEY,
    model: parsedConfig.data.OPENROUTER_MODEL,
  },
} as const;
