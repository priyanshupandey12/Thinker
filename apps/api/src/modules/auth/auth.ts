import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { config } from "../../config/config";
import { database } from "../../infrastructure/database/client";
import * as schema from "../../infrastructure/database/schema/auth";

// Allow the public site to run while OAuth credentials are being configured.
const { secret, githubClientId, githubClientSecret, baseUrl } = config.auth;
export const auth =
  secret &&
  secret.length >= 32 &&
  !secret.startsWith("replace-") &&
  githubClientId &&
  githubClientSecret
    ? betterAuth({
        appName: "Thinker",
        baseURL: baseUrl,
        secret,
        trustedOrigins: [config.appOrigin],
        // Keep origin and CSRF checks active in every environment, including tests.
        advanced: { disableOriginCheck: false, disableCSRFCheck: false },
        database: drizzleAdapter(database, { provider: "pg", schema }),
        socialProviders: {
          github: { clientId: githubClientId, clientSecret: githubClientSecret },
        },
        account: { encryptOAuthTokens: true },
        rateLimit: { enabled: true },
      })
    : null;
