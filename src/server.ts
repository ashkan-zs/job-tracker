import express from "express";

import applicationsRouter from "./routes/applications.routes.js";

// Express setup
const app = express();
const port = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/applications", applicationsRouter);

app.listen(port, () => {
  console.log(`Job tracker API listening on ${port}`);
});
