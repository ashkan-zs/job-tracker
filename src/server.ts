import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

// Types
type Application = {
  id: number;
  company: string;
  position: string;
  status: "applied" | "interview" | "rejected" | "offer";
};

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

// Middleware
const validateApplicationId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const applicationId = Number(req.params.id);

  if (!Number.isInteger(applicationId) || applicationId < 1) {
    return res.status(400).json({ message: "Invalid job application ID" });
  }

  next();
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
  const applicationId = Number(req.params.id);

  const application = applications.find(
    (application) => application.id === applicationId,
  );

  if (!application) {
    return res.status(404).json({ message: "Job Application not found!" });
  }

  res.json(application);
});

app.post("/applications", (req, res) => {
  const newApplication = req.body;
  const application = { ...newApplication, id: getNextId(applications) };

  applications.push(application);

  res.status(201).json(application);
});

app.delete("/applications/:id", validateApplicationId, (req, res) => {
  const applicationId = Number(req.params.id);

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
  const applicationId = Number(req.params.id);
  const content = req.body;

  const applicationIndex = applications.findIndex(
    (application) => application.id === applicationId,
  );

  if (applicationIndex === -1) {
    return res.status(404).json({ message: "Job application not found!" });
  }

  applications[applicationIndex] = {
    ...applications[applicationIndex],
    ...content,
    id: applicationId,
  };

  res.json(applications[applicationIndex]);
});

app.listen(port, () => {
  console.log(`Job tracker API listening on ${port}`);
});
