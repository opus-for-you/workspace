// Reference: javascript_database blueprint
import 'dotenv/config';
import { Pool as PgPool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use Neon serverless for production (neon.tech), regular pg for local development
const isNeon = process.env.DATABASE_URL.includes('neon.tech');

let pool: PgPool | NeonPool;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeon) {
  neonConfig.webSocketConstructor = ws;
  const neonPool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  pool = neonPool;
  db = drizzleNeon({ client: neonPool, schema });
} else {
  const pgPool = new PgPool({ connectionString: process.env.DATABASE_URL });
  pool = pgPool;
  db = drizzlePg(pgPool, { schema });
}

export { pool, db };
