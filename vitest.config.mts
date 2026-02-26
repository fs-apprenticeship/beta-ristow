import react from "@vitejs/plugin-react";
import { config as loadEnv } from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

loadEnv({ override: true, path: ".env.test" });
loadEnv({ override: false, path: ".env" });

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: [
      "src/test/setup/dom.ts",
      "src/test/setup/prisma.ts",
      "src/test/setup/vitest-axe.ts",
    ],
  },
});
