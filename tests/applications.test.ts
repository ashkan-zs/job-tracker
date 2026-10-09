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

describe("POST /applications", () => {
  test("should create an application with valid data", async () => {
    const newApplication = {
      company: "Google",
      position: "Frontend Developer",
      status: "applied",
    };

    const response = await request(app)
      .post("/applications")
      .send(newApplication);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newApplication);
    expect(response.body.id).toEqual(expect.any(Number));
  });

  test.each([
    {
      name: "company is invalid",
      body: {
        position: "frontend",
        status: "applied",
      },
    },
    {
      name: "status is invalid",
      body: {
        company: "ab-hayat",
        position: "frontend",
        status: "pending",
      },
    },
  ])("should return 400 when $name", async ({ body }) => {
    const response = await request(app).post("/applications").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});
