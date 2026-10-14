import { pool } from "../db/pool.js";
import type {
  Application,
  CreateApplication,
  UpdateApplication,
} from "../schemas/application.schema.js";

export const getApplications = async (): Promise<Application[]> => {
  const result = await pool.query<Application>("SELECT * FROM applications");
  return result.rows;
};

export const getApplicationById = async (
  id: number,
): Promise<Application | null> => {
  const result = await pool.query<Application>(
    "SELECT * FROM applications WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
};

export const addApplication = async (
  application: CreateApplication,
): Promise<Application> => {
  const result = await pool.query<Application>(
    `INSERT INTO applications (company, position, status)
     VALUES($1, $2, $3)
     RETURNING *`,
    [application.company, application.position, application.status],
  );

  const createdApplication = result.rows[0];

  if (!createdApplication) {
    throw new Error("Failed to create application");
  }

  return createdApplication;
};

export const deleteApplicationById = async (id: number) => {
  const result = await pool.query("DELETE FROM applications WHERE id=$1", [id]);

  return result.rowCount;
};

export const updateApplication = async (
  id: number,
  data: UpdateApplication,
): Promise<Application | null> => {
  const result = await pool.query(
    `UPDATE applications
     SET 
      company=COALESCE($1, company),
      position=COALESCE($2, position),
      status=COALESCE($3, status)
     WHERE id=$4
     RETURNING *`,
    [data.company ?? null, data.position ?? null, data.status ?? null, id],
  );

  return result.rows[0] ?? null;
};
