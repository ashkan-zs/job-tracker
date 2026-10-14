import express, { type Express } from "express";

import applicationsRouter from "./routes/applications.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";

// Express setup
const app: Express = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/applications", applicationsRouter);

app.use(errorHandler);

export default app;
