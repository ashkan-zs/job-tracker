import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /applications", () => {
  test("should return an array of applications", async () => {
    const response = await request(app).get("/applications");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("GET /applications/:id", () => {
  test("should return an application when ID exists", async () => {
    const response = await request(app).get("/applications/1");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 1,
      company: "flex",
      position: "frontend",
      status: "applied",
    });
  });

  test("should return 404 when application does not exist", async () => {
    const response = await request(app).get("/applications/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Job application not found!",
    });
  });

  test("should return 400 when ID is invalid", async () => {
    const response = await request(app).get("/applications/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid job application ID",
    });
  });
});
