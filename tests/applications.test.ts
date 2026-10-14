import { afterAll, beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import {
  closeDatabase,
  resetDatabase,
  seedApplication,
} from "./helper/database.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("GET /applications", () => {
  test("should return an empty array when no applications exist", async () => {
    const response = await request(app).get("/applications");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  test("should return all applications", async () => {
    await seedApplication({
      company: "flex",
      position: "frontend",
      status: "applied",
    });

    await seedApplication({
      company: "google",
      position: "backend",
      status: "interview",
    });

    const response = await request(app).get("/applications");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});

describe("GET /applications/:id", () => {
  test("should return an application when ID exists", async () => {
    const id = await seedApplication({
      company: "Google",
      position: "Backend Developer",
      status: "interview",
    });

    const response = await request(app).get(`/applications/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.company).toBe("Google");
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
      company: "Vodafon",
      position: "Frontend Developer",
      status: "applied",
    };

    const response = await request(app)
      .post("/applications")
      .send(newApplication);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newApplication);
    expect(response.body.id).toEqual(expect.any(Number));

    const listResponse = await request(app).get("/applications");

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0]).toMatchObject({
      id: response.body.id,
      ...newApplication,
    });
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
    expect(response.body).toMatchObject({
      message: "Invalid application data",
    });
  });
});

describe("PATCH /applications/:id", () => {
  test("should update an existing application", async () => {
    const id = await seedApplication({
      company: "flex",
      position: "frontend",
      status: "applied",
    });

    const body = {
      status: "interview",
    };

    const response = await request(app).patch(`/applications/${id}`).send(body);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: id,
      company: "flex",
      position: "frontend",
      status: "interview",
    });

    const updatedItem = await request(app).get(`/applications/${id}`);
    expect(updatedItem.body).toEqual(response.body);
  });

  test("should preserve status when updating only company", async () => {
    const id = await seedApplication({
      company: "flex",
      position: "frontend",
      status: "applied",
    });

    const response = await request(app)
      .patch(`/applications/${id}`)
      .send({ company: "Microsoft" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("applied");
    expect(response.body.company).toBe("Microsoft");
  });

  test("should return 400 when ID is invalid", async () => {
    const body = {
      status: "interview",
    };

    const response = await request(app).patch("/applications/abc").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test.each([
    { name: "is invalid", body: { status: "pending" } },
    { name: "is empty", body: {} },
  ])("should return 400 when body $name", async ({ body }) => {
    const id = await seedApplication({
      company: "flex",
      position: "frontend",
      status: "applied",
    });
    const response = await request(app).patch(`/applications/${id}`).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid application data");
  });

  test("should return 404 when ID does not exist", async () => {
    const body = {
      status: "interview",
    };

    const response = await request(app).patch("/applications/99").send(body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});

describe("DELETE /applications/:id", () => {
  test("should delete an application", async () => {
    const id = await seedApplication({
      company: "flex",
      position: "frontend",
      status: "applied",
    });

    const response = await request(app).delete(`/applications/${id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});

    const getDeletedItem = await request(app).get(`/applications/${id}`);

    expect(getDeletedItem.status).toBe(404);
  });
  test("should return 404 when ID does not exist", async () => {
    const response = await request(app).delete("/applications/99");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
  test("should return 400 when ID is invalid", async () => {
    const response = await request(app).delete("/applications/abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
