import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit is a standalone CLI, not the Next.js runtime, so it doesn't
// automatically load .env.local the way `next dev`/`next build` do.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
