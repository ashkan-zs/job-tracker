import { beforeEach, describe, expect, test } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetApplications } from "../src/data/applications.store.js";

beforeEach(() => {
  resetApplications();
});

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

    const listResponse = await request(app).get("/applications");

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(4);
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

describe("PATCH /applications/:id", () => {
  test("should update an existing application", async () => {
    const body = {
      status: "interview",
    };

    const response = await request(app).patch("/applications/2").send(body);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 2,
      company: "strong",
      position: "frontend",
      status: "interview",
    });

    const updatedItem = await request(app).get("/applications/2");
    expect(response.body).toMatchObject(updatedItem.body);
  });

  test("should preserve status when updating only company", async () => {
    const response = await request(app)
      .patch("/applications/2")
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
    const response = await request(app).patch("/applications/2").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid job application data",
    );
    expect(response.body.errors.length).toBeGreaterThan(0);
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
    const response = await request(app).delete("/applications/2");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});

    const getDeletedItem = await request(app).get("/applications/2");

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
