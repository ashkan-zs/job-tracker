import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

const env = loadEnv("test", process.cwd(), "");

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env.test");
}

const databaseName = new URL(env.DATABASE_URL).pathname.slice(1);

if (databaseName !== "jobtracker_test") {
  throw new Error("Tests must use the jobtracker_test database");
}

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: env.DATABASE_URL,
    },
    fileParallelism: false,
  },
});