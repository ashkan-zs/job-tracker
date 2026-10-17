import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid application data",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.status(404).json({
      message: "Job application not found!",
    });
  }
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
};
