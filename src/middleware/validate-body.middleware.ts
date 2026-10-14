import type { RequestHandler } from "express";
import type { z } from "zod";

export const validateBody = (schema: z.ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    req.body = result.data;
    next();
  };
};