import bcrypt from "bcrypt";
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

describe("registerUser", () => {
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

  it("should return a 400 error if the email is already in use", async () => {
    // 1. ARRANGE: Create a user in the database first
    await User.create({
      fullName: "Existing User",
      email: "exists@example.com",
      password: "password123",
      deviceId: "device-123",
    });

    // Prepare the data for the new user trying to register with the same email
    const newUser = {
      fullName: "New User",
      email: "exists@example.com", // Same email
      password: "password456",
      deviceId: "device-456",
    };

    // 2. ACT: Send the request
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(newUser);

    // 3. ASSERT: Check for the error response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });
});

describe("loginUser", () => {
  it("should login an existing user successfully", async () => {
    // 1. ARRANGE: Create a user first
    const userData = {
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      deviceId: "device-123",
      deviceVerified: true,
    };
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
      ...userData,
      password: hashedPassword,
    });

    // 2. ACT: Attempt to login
    const response = await request(app).post("/api/v1/auth/login").send({
      email: userData.email,
      password: userData.password,
      pushToken: "new-push-token",
    });

    // 3. ASSERT
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user).not.toHaveProperty("password");

    // Verify push token was updated
    const updatedUser = await User.findOne({ email: userData.email });
    expect(updatedUser.pushToken).toBe("new-push-token");
  });

  it("should return 401 for invalid email", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should return 401 for invalid password", async () => {
    // 1. ARRANGE: Create a user
    const userData = {
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      deviceId: "device-123",
      deviceVerified: true,
    };
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
      ...userData,
      password: hashedPassword,
    });

    // 2. ACT: Attempt login with wrong password
    const response = await request(app).post("/api/v1/auth/login").send({
      email: userData.email,
      password: "wrongpassword",
    });

    // 3. ASSERT
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should return 403 for unverified device", async () => {
    // 1. ARRANGE: Create user with unverified device
    const userData = {
      fullName: "Test User",
      email: "test@example.com",
      password: "password123",
      deviceId: "device-123",
      deviceVerified: false,
    };
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
      ...userData,
      password: hashedPassword,
    });

    // 2. ACT: Attempt to login
    const response = await request(app).post("/api/v1/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    // 3. ASSERT
    expect(response.status).toBe(403);
    expect(response.body.message).toContain("Device not verified");
  });
});
