import { prisma } from "../src/lib/prisma.js";

async function main() {
  try {
    const result = await prisma.applications.findMany();

    console.log("connected to PostgreSQL");
    console.log(result);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

await main();
