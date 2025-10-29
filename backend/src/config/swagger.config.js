import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Savings Management System API",
    version: "1.0.0",
    description:
      "API documentation for the Savings Management System, including user, savings, and admin endpoints.",
    contact: {
      name: "API Support",
      email: process.env.ADMIN_EMAIL || "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:" + (process.env.PORT || 6000),
      description: "Local",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Provide the access token as: Bearer <token>. Admin endpoints require tokens with isAdmin=true.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid email or password" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          balance: { type: "number" },
          deviceVerified: { type: "boolean" },
          deviceId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Admin: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          type: { type: "string", enum: ["deposit", "withdrawal"] },
          amount: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      AdminLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login successful" },
          accessToken: { type: "string" },
          admin: { $ref: "#/components/schemas/Admin" },
        },
      },
      UserLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login successful" },
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
    },
  },
  tags: [
    { name: "Auth", description: "User authentication" },
    { name: "Savings", description: "Savings operations" },
    { name: "Admin", description: "Admin operations" },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/routes/*.js", // JSDoc annotations in route files
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
