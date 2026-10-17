import { prisma } from "../../src/lib/prisma.js";
import type { CreateApplication } from "../../src/schemas/application.schema.js";

export const resetDatabase = async () => {
  const result = await prisma.$queryRaw<Array<{ current_database: string }>>`
    SELECT current_database()
  `;

  if (result[0]?.current_database !== "jobtracker_test") {
    throw new Error("Refusing to reset a non-test database");
  }

  await prisma.$executeRaw`TRUNCATE TABLE applications RESTART IDENTITY`;
};

export const closeDatabase = async () => {
  await prisma.$disconnect();
};

export const seedApplication = async (
  application: CreateApplication,
): Promise<number> => {
  const result = await prisma.$queryRaw<Array<{ id: number }>>`
    INSERT INTO applications (company, position, status)
    VALUES (${application.company}, ${application.position}, ${application.status})
    RETURNING id
  `;

  const row = result[0];

  if (!row) {
    throw new Error("Failed to seed application");
  }

  return row.id;
};
