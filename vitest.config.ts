/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      include: [
        "src/features/*/services/**",
        "src/features/*/repository/**",
        "src/core/billing/**",
        "src/core/ads/**",
        "src/core/database/**",
        "src/core/prediction/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
