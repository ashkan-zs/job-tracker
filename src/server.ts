import express from "express";

type Application = {
  id: number;
  company: string;
  position: string;
  status: "applied" | "interview" | "rejected" | "offer";
};

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

const app = express();
const port = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/applications", (req, res) => {
  res.json(applications);
});

app.listen(port, () => {
  console.log(`Job tracker API listening on ${port}`);
});
