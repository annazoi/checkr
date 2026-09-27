import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Falls back to a placeholder so `next build`'s page-data collection (which
// imports this module even for routes that never execute a query at build
// time) doesn't crash when DATABASE_URL isn't set yet. Any real query still
// fails at request time against a real environment without it.
const sql = neon(process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/placeholder");

export const db = drizzle(sql, { schema });
