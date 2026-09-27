import type { Server } from "node:http";
import express from "express";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({
  auth: { api: { getSession: vi.fn() } } as {
    api: { getSession: ReturnType<typeof vi.fn> };
  } | null,
  getSession: vi.fn(),
}));

vi.mock("./auth", () => ({
  get auth() {
    return authState.auth;
  },
}));
const { authRouter } = await import("./auth.routes");
const { errorHandler } = await import("../../shared/http/error-handler");

let server: Server;
let baseUrl: string;
beforeAll(async () => {
  const app = express();
  app.use(authRouter);
  app.use(errorHandler);
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test server address");
  baseUrl = `http://127.0.0.1:${address.port}`;
});
beforeEach(() => {
  authState.getSession.mockReset();
  authState.auth = { api: { getSession: authState.getSession } };
});
afterAll(
  () =>
    new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    }),
);

describe("authentication HTTP boundary", () => {
  it("rejects requests without a valid session", async () => {
    authState.getSession.mockResolvedValue(null);
    const response = await fetch(`${baseUrl}/api/v1/me`);
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: { code: "UNAUTHENTICATED" } });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("forwards cookies for validation and returns only public identity fields", async () => {
    authState.getSession.mockResolvedValue({
      user: {
        id: "user-1",
        name: "Learner",
        email: "learner@example.test",
        image: null,
        internalField: "private",
      },
      session: { token: "must-not-leak" },
    });
    const response = await fetch(`${baseUrl}/api/v1/me`, {
      headers: { Cookie: "better-auth.session_token=test" },
    });
    expect(response.status).toBe(200);
    expect(authState.getSession.mock.calls[0]?.[0].headers.get("cookie")).toBe(
      "better-auth.session_token=test",
    );
    expect(await response.json()).toEqual({
      data: { id: "user-1", name: "Learner", email: "learner@example.test", image: null },
    });
  });

  it("does not treat an identity lookup error as a signed-out session", async () => {
    authState.getSession.mockRejectedValue(new Error("Database unavailable"));
    const response = await fetch(`${baseUrl}/api/v1/me`);
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: { message: "Something went wrong." } });
  });

  it("reports provider readiness without exposing credentials", async () => {
    expect(await (await fetch(`${baseUrl}/api/v1/auth/status`)).json()).toEqual({
      data: { githubEnabled: true },
    });
    authState.auth = null;
    expect(await (await fetch(`${baseUrl}/api/v1/auth/status`)).json()).toEqual({
      data: { githubEnabled: false },
    });
  });

  it("keeps unconfigured authentication closed with a recoverable error", async () => {
    authState.auth = null;
    const response = await fetch(`${baseUrl}/api/auth/sign-in/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "github" }),
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: { code: "AUTH_UNAVAILABLE" } });
    expect((await fetch(`${baseUrl}/api/v1/me`)).status).toBe(401);
  });
});
