import type { NextFunction, Request, Response } from "express";

type ApplicationLocals = {
  applicationId: number;
};

export const validateApplicationId = (
  req: Request,
  res: Response<unknown, ApplicationLocals>,
  next: NextFunction,
) => {
  const applicationId = Number(req.params.id);

  if (!Number.isInteger(applicationId) || applicationId < 1) {
    return res.status(400).json({ message: "Invalid job application ID" });
  }

  res.locals.applicationId = applicationId;
  next();
};
