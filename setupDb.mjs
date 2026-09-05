// setupDb.mjs
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT) || 5433,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "postgres",
  database: process.env.PG_DATABASE || "sql_class_2_db",
});

const schema = `
  CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS seats (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      isbooked INT DEFAULT 0,
      user_id INT REFERENCES users(id)
  );

  ALTER TABLE seats ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id);

  INSERT INTO seats (isbooked)
  SELECT 0 FROM generate_series(1, 20)
  WHERE NOT EXISTS (SELECT 1 FROM seats);
`;

async function runSetup() {
  try {
    console.log("Connecting to PostgreSQL and running migrations...");
    await pool.query(schema);
    console.log("Database schema initialized successfully!");
  } catch (err) {
    console.error("Database setup failed:", err);
  } finally {
    await pool.end();
  }
}

runSetup();