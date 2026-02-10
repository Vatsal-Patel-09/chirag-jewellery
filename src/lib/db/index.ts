import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Gracefully handle missing DATABASE_URL during build
const sql = connectionString
  ? neon(connectionString)
  : ((() => {
      throw new Error("DATABASE_URL is not set");
    }) as unknown as ReturnType<typeof neon>);

export const db = connectionString ? drizzle(sql, { schema }) : (null as unknown as ReturnType<typeof drizzle<typeof schema>>);
