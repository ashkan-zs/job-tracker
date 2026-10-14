import { pool } from "../../src/db/pool.js";
import type { CreateApplication } from "../../src/schemas/application.schema.js";

export const resetDatabase = async () => {
  const result = await pool.query<{ current_database: string }>(
    "SELECT current_database()",
  );

  if (result.rows[0]?.current_database !== "jobtracker_test") {
    throw new Error("Refusing to reset a non-test database");
  }

  await pool.query("TRUNCATE TABLE applications RESTART IDENTITY");
};

export const closeDatabase = async () => {
  await pool.end();
};

export const seedApplication = async (
  application: CreateApplication,
): Promise<number> => {
  const result = await pool.query<{ id: number }>(
    `INSERT INTO applications (company, position, status)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [application.company, application.position, application.status],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Failed to seed application");
  }

  return row.id;
};
