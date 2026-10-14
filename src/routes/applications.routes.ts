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
