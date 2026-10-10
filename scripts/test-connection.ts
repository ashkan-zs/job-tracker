import { pool } from "../src/db/pool.js";

async function main() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    console.log("connected to PostgreSQL");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

await main();
