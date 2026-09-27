import type { Server } from "node:http";
import express from "express";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Exercise the real Better Auth configuration with ephemeral test storage.
vi.mock("../../infrastructure/database/client", () => ({ database: {} }));
vi.mock("better-auth/adapters/drizzle", async () => {
  const { memoryAdapter } = await import("better-auth/adapters/memory");
  return {
    drizzleAdapter: () => memoryAdapter({ user: [], session: [], account: [], verification: [] }),
  };
});
vi.stubEnv("BETTER_AUTH_SECRET", "test-only-secret-0123456789-abcdefghijklmnopqrstuvwxyz");
vi.stubEnv("GITHUB_CLIENT_ID", "thinker-test-client");
vi.stubEnv("GITHUB_CLIENT_SECRET", "thinker-test-client-secret");
vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
vi.stubEnv("APP_ORIGIN", "http://localhost:5173");
const { authRouter } = await import("./auth.routes");

let server: Server;
let baseUrl: string;
beforeAll(async () => {
  const app = express();
  app.use(authRouter);
  app.use(express.json());
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test server address");
  baseUrl = `http://127.0.0.1:${address.port}`;
});
afterAll(
  () =>
    new Promise<void>((resolve, reject) => {
      vi.unstubAllEnvs();
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    }),
);

function beginSignIn(origin: string, callbackURL = "http://localhost:5173/app", cookie?: string) {
  return fetch(`${baseUrl}/api/auth/sign-in/social`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify({ provider: "github", callbackURL, disableRedirect: true }),
  });
}

describe("GitHub OAuth integration", () => {
  it("creates a GitHub authorization URL and state cookie through Express", async () => {
    const response = await beginSignIn("http://localhost:5173");
    expect(response.status).toBe(200);
    const body = (await response.json()) as { url: string };
    const url = new URL(body.url);
    expect(url.origin).toBe("https://github.com");
    expect(url.searchParams.get("client_id")).toBe("thinker-test-client");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://localhost:3000/api/auth/callback/github",
    );
    expect(url.searchParams.get("state")).toBeTruthy();
    expect(url.searchParams.get("scope")).not.toMatch(/\brepo\b/);
    expect(response.headers.get("set-cookie")).toMatch(/httponly/i);
  });
  it("rejects cookie-bearing sign-in from an untrusted origin", async () => {
    const response = await beginSignIn(
      "https://untrusted.example",
      undefined,
      "better-auth.session_token=test-cookie",
    );
    expect(response.status).toBe(403);
  });
  it("rejects a callback to an untrusted site", async () => {
    expect(
      (await beginSignIn("http://localhost:5173", "https://untrusted.example/app")).status,
    ).toBe(403);
  });
  it("rejects sign-out from an untrusted origin", async () => {
    const response = await fetch(`${baseUrl}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://untrusted.example",
        Cookie: "better-auth.session_token=test-cookie",
      },
      body: "{}",
    });
    expect(response.status).toBe(403);
  });
});
