
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/e2e/**/*.test.ts"],
    testTimeout: 70000,
    hookTimeout: 70000,
  },
});
