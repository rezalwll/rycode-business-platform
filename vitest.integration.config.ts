import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !new URL(databaseUrl).pathname.replace(/^\//, "").endsWith("_validation")) {
  throw new Error(
    "Integration tests require a disposable database whose name ends in _validation.",
  );
}

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/integration/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.integration.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
  },
});
