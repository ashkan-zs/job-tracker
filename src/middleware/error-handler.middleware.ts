import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Invalid application data",
    });
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
};
