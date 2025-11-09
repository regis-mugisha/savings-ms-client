import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { User } from "../src/models/user.model.js";

let mongoServer;

// Connect to in-memory MongoDB before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("registerUser", async () => {
  it("should register a new user successfully", async () => {
    const newUser = {
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      deviceId: "device-123",
      pushToken: "token-abc",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user).not.toHaveProperty("password");

    //   check the database directly
    const dbUser = await User.findOne({ email: newUser.email });
    expect(dbUser).not.toBeNull();
    expect(dbUser.fullName).toBe(newUser.fullName);
    expect(dbUser.password).not.toBe(newUser.password); // Password should be hashed
  });
});
