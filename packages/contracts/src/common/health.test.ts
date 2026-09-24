import { describe, expect, it } from "vitest";
import { healthResponseSchema } from "./health";

describe("healthResponseSchema", () => {
  it("accepts the public API health response", () => {
    expect(
      healthResponseSchema.parse({
        data: { service: "thinker-api", status: "ok" },
      }),
    ).toEqual({
      data: { service: "thinker-api", status: "ok" },
    });
  });

  it("rejects an unknown service name", () => {
    expect(() =>
      healthResponseSchema.parse({
        data: { service: "worker", status: "ok" },
      }),
    ).toThrow();
  });
});
