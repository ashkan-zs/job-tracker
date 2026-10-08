import express from "express";

import {
  createApplicationSchema,
  updateApplicationSchema,
  type Application,
} from "./schemas/application.schema.js";

import { validateApplicationId } from "./middleware/validate-application-id.js";

// Data
const applications: Application[] = [
  {
    id: 1,
    company: "flex",
    position: "frontend",
    status: "applied",
  },
  {
    id: 2,
    company: "strong",
    position: "frontend",
    status: "applied",
  },
  {
    id: 3,
    company: "blue",
    position: "frontend",
    status: "applied",
  },
];

// Helper functions
const getNextId = (applications: Application[]) => {
  const maxId = applications.reduce(
    (max, application) => Math.max(max, application.id),
    0,
  );

  return maxId + 1;
};

// Express setup
const app = express();
const port = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/applications", (req, res) => {
  res.json(applications);
});

app.get("/applications/:id", validateApplicationId, (req, res) => {
  const applicationId = res.locals.applicationId;

  const application = applications.find(
    (application) => application.id === applicationId,
  );

  if (!application) {
    return res.status(404).json({ message: "Job Application not found!" });
  }

  res.json(application);
});

app.post("/applications", (req, res) => {
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

app.delete("/applications/:id", validateApplicationId, (req, res) => {
  const applicationId = res.locals.applicationId;

  const applicationIndex = applications.findIndex(
    (application) => application.id === applicationId,
  );

  if (applicationIndex === -1) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  applications.splice(applicationIndex, 1);

  res.status(204).send();
});

app.patch("/applications/:id", validateApplicationId, (req, res) => {
  const applicationId = res.locals.applicationId;
  const requestData = updateApplicationSchema.safeParse(req.body);

  if (!requestData.success) {
    return res.status(400).json({
      message: "Invalid job application data",
      errors: requestData.error.issues,
    });
  }
  const applicationIndex = applications.findIndex(
    (application) => application.id === applicationId,
  );

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

  res.json(applications[applicationIndex]);
});

app.listen(port, () => {
  console.log(`Job tracker API listening on ${port}`);
});
