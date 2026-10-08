import request from "supertest";
import { describe, expect, test } from "vitest";

import app from "../src/app.js";

describe("Health API", () => {
  test("should return 200 and status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
