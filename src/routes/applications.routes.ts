import { Router } from "express";

import {
  createApplicationSchema,
  updateApplicationSchema,
  type Application,
  type CreateApplication,
  type UpdateApplication,
} from "../schemas/application.schema.js";
import { validateApplicationId } from "../middleware/validate-application-id.middleware.js";
import { pool } from "../db/pool.js";

// Helper functions
const getApplications = async (): Promise<Application[]> => {
  const result = await pool.query<Application>("SELECT * FROM applications");
  return result.rows;
};

const getApplicationById = async (id: number): Promise<Application | null> => {
  const result = await pool.query<Application>(
    "SELECT * FROM applications WHERE id = $1",
    [id],
  );
  return result.rows[0] ?? null;
};

const addApplication = async (
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

const deleteApplicationById = async (id: number) => {
  const result = await pool.query("DELETE FROM applications WHERE id=$1", [id]);

  return result.rowCount;
};

const updateApplication = async (
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

const router: Router = Router();

router.get("/", async (req, res) => {
  res.json(await getApplications());
});

router.get("/:id", validateApplicationId, async (req, res) => {
  const applicationId = res.locals.applicationId;

  const application = await getApplicationById(applicationId);

  if (!application) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  res.json(application);
});

router.post("/", async (req, res) => {
  const requestData = createApplicationSchema.safeParse(req.body);

  if (!requestData.success) {
    return res.status(400).json({
      message: "Invalid job application data",
      errors: requestData.error.issues,
    });
  }

  const application = await addApplication(requestData.data);

  res.status(201).json(application);
});

router.delete("/:id", validateApplicationId, async (req, res) => {
  const applicationId = res.locals.applicationId;

  const deletedCount = await deleteApplicationById(applicationId);

  if (deletedCount === 0) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  res.status(204).send();
});

router.patch("/:id", validateApplicationId, async (req, res) => {
  const applicationId = res.locals.applicationId;
  const requestData = updateApplicationSchema.safeParse(req.body);

  if (!requestData.success) {
    return res.status(400).json({
      message: "Invalid job application data",
      errors: requestData.error.issues,
    });
  }

  const existingApplication = await getApplicationById(applicationId);

  if (!existingApplication) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  const updatedApplication = await updateApplication(
    applicationId,
    requestData.data,
  );

  if (!updatedApplication) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  res.json(updatedApplication);
});

export default router;
