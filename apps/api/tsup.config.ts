import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    http: "src/entrypoints/http.ts",
    worker: "src/entrypoints/worker.ts",
  },
  clean: true,
  format: ["esm"],
  noExternal: ["@thinker/contracts"],
  target: "es2023",
});
