import { prisma } from "../lib/prisma.js";
import type {
  CreateApplication,
  UpdateApplication,
} from "../schemas/application.schema.js";

export const getApplications = async () => {
  return prisma.applications.findMany({
    orderBy: { id: "asc" },
  });
};

export const getApplicationById = async (id: number) => {
  return prisma.applications.findUnique({
    where: { id },
  });
};

export const addApplication = async (application: CreateApplication) => {
  return prisma.applications.create({
    data: application,
  });
};

export const deleteApplicationById = async (id: number) => {
  const result = prisma.applications.deleteMany({
    where: { id },
  });

  return (await result).count;
};

export const updateApplication = async (
  id: number,
  data: UpdateApplication,
) => {
  return prisma.applications.update({
    where: { id },
    data: {
      ...(data.company !== undefined && { company: data.company }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });
};
