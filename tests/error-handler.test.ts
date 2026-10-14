import { describe, expect, test } from "vitest";
import express from "express";
import request from "supertest";
import z from "zod";

import { AppError } from "../src/errors/app-error.js";
import { errorHandler } from "../src/middleware/error-handler.middleware.js";
import { validateBody } from "../src/middleware/validate-body.middleware.js";

describe("Error Handler", () => {
  test("returns the correct status for AppError", async () => {
    const app = express();

    app.get("/error", () => {
      throw new AppError(403, "Forbidden");
    });

    app.use(errorHandler);

    const response = await request(app).get("/error");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden",
    });
  });
  test("returns 500 without exposing internal error details", async () => {
    const app = express();

    app.get("/server-error", () => {
      throw new Error("Database password is secret123");
    });

    app.use(errorHandler);

    const serverError = await request(app).get("/server-error");

    expect(serverError.status).toBe(500);
    expect(serverError.body).toEqual({
      message: "Internal server error",
    });
  });
  test("returns 400 for Zod validation errors", async () => {
    const app = express();

    const schema = z.object({
      company: z.string().min(1),
    });

    app.use(express.json());

    app.post("/validate", validateBody(schema), (req, res) => {
      res.status(201).json(req.body);
    });

    app.use(errorHandler);

    const response = await request(app).post("/validate").send({ company: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid application data",
    });
  });
});
