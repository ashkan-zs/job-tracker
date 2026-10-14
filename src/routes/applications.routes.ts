import { Router } from "express";

import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../schemas/application.schema.js";
import { validateApplicationId } from "../middleware/validate-application-id.middleware.js";
import {
  addApplication,
  deleteApplicationById,
  getApplicationById,
  getApplications,
  updateApplication,
} from "../repositories/applications.repository.js";
import { AppError } from "../errors/app-error.js";
import { validateBody } from "../middleware/validate-body.middleware.js";

const router: Router = Router();

router.get("/", async (req, res) => {
  res.json(await getApplications());
});

router.get("/:id", validateApplicationId, async (req, res) => {
  const applicationId = res.locals.applicationId;

  const application = await getApplicationById(applicationId);

  if (!application) {
    throw new AppError(404, "Job application not found!");
  }

  res.json(application);
});

router.post("/", validateBody(createApplicationSchema), async (req, res) => {
  const application = await addApplication(req.body);

  res.status(201).json(application);
});

router.delete("/:id", validateApplicationId, async (req, res) => {
  const applicationId = res.locals.applicationId;

  const deletedCount = await deleteApplicationById(applicationId);

  if (deletedCount === 0) {
    throw new AppError(404, "Job application not found!");
  }

  res.status(204).send();
});

router.patch(
  "/:id",
  validateApplicationId,
  validateBody(updateApplicationSchema),
  async (req, res) => {
    const applicationId = res.locals.applicationId;

    const existingApplication = await getApplicationById(applicationId);

    if (!existingApplication) {
      throw new AppError(404, "Job application not found!");
    }

    const updatedApplication = await updateApplication(applicationId, req.body);

    if (!updatedApplication) {
      throw new AppError(404, "Job application not found!");
    }

    res.json(updatedApplication);
  },
);

export default router;
