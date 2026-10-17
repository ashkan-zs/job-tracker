import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = 3000;

const server = app.listen(port, () => {
  console.log(`Job tracker API listening on ${port}`);
});

let shutdownPromise: Promise<void> | undefined;

const shutdown = (signal: NodeJS.Signals) => {
  if (shutdownPromise) return;

  console.log(`${signal} received; shutting down`);
  shutdownPromise = new Promise<void>((resolve) => {
    server.close((error) => {
      if (error) {
        console.error("Failed to close HTTP server", error);
      }

      resolve();
    });
  }).then(async () => {
    await prisma.$disconnect();
  }).catch((error: unknown) => {
    console.error("Failed to shut down cleanly", error);
    process.exitCode = 1;
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
