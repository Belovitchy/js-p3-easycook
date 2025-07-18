// Get variables from .env file for database connection
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV,
  DATABASE_URL,
} = process.env;

console.log("DATABASE_URL:", DATABASE_URL);

// Create a connection pool to the PostgreSQL database
import { Pool } from "pg";

const client = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Obligatoire avec Render (pas de certificat client valide)
  },
});

// Ready to export
export default client;

// Types export
import type { PoolClient, QueryResult } from "pg";

type DatabaseClient = Pool;
type Result = QueryResult;
type Rows = QueryResult["rows"];

export type { DatabaseClient, Result, Rows };
