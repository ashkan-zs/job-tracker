import { Router } from "express";

import {
  createApplicationSchema,
  updateApplicationSchema,
  type Application,
} from "../schemas/application.schema.js";
import { validateApplicationId } from "../middleware/validate-application-id.middleware.js";
import { applications } from "../data/applications.store.js";

// Helper functions
const getNextId = (applications: Application[]) => {
  const maxId = applications.reduce(
    (max, application) => Math.max(max, application.id),
    0,
  );

  return maxId + 1;
};

const getApplications = () => {
  return applications;
};

const getApplicationById = (id: number) => {
  return applications.find((application) => application.id === id);
};

const getApplicationIndex = (id: number) => {
  return applications.findIndex((application) => application.id === id);
};

const router: Router = Router();

router.get("/", (req, res) => {
  res.json(getApplications());
});

router.get("/:id", validateApplicationId, (req, res) => {
  const applicationId = res.locals.applicationId;

  const application = getApplicationById(applicationId);

  if (!application) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  res.json(application);
});

router.post("/", (req, res) => {
  const requestData = createApplicationSchema.safeParse(req.body);

  if (!requestData.success) {
    return res.status(400).json({
      message: "Invalid job application data",
      errors: requestData.error.issues,
    });
  }

  const application = { ...requestData.data, id: getNextId(applications) };

  applications.push(application);

  res.status(201).json(application);
});

router.delete("/:id", validateApplicationId, (req, res) => {
  const applicationId = res.locals.applicationId;

  const applicationIndex = getApplicationIndex(applicationId);

  if (applicationIndex === -1) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  applications.splice(applicationIndex, 1);

  res.status(204).send();
});

router.patch("/:id", validateApplicationId, (req, res) => {
  const applicationId = res.locals.applicationId;
  const requestData = updateApplicationSchema.safeParse(req.body);

  if (!requestData.success) {
    return res.status(400).json({
      message: "Invalid job application data",
      errors: requestData.error.issues,
    });
  }
  const applicationIndex = getApplicationIndex(applicationId);

  const existingApplication = applications[applicationIndex];

  if (!existingApplication) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  const updatedApplication: Application = {
    id: applicationId,
    company: requestData.data.company ?? existingApplication.company,
    position: requestData.data.position ?? existingApplication.position,
    status: requestData.data.status ?? existingApplication.status,
  };

  applications[applicationIndex] = updatedApplication;

  res.json(updatedApplication);
});

export default router;
