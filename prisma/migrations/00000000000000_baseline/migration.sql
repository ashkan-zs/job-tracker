-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "company" VARCHAR(150) NOT NULL,
    "position" VARCHAR(150) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'applied',

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

--- Create valid_status Constraint for application Table
ALTER TABLE "applications"
ADD CONSTRAINT "valid_status"
CHECK (
  "status" IN ('applied', 'interview', 'rejected', 'offer')
);
