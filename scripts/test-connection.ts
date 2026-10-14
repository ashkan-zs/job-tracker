import { pool } from "../src/db/pool.js";

async function main() {
  try {
    const result = await pool.query("SELECT * FROM applications");

    console.log("connected to PostgreSQL");
    console.log(result.rows);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

await main();
