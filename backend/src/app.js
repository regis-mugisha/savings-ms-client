import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import savingsRoutes from "./routes/savings.route.js";

const app = express();

// Enable CORS first
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://savings-ms-admin-panel.vercel.app",
    ],
    credentials: "true",
  })
);

// Security middleware
app.use(helmet());

// Parse JSON payloads and sanitize
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Savings Management System API:v1");
});
app.get("/api/v1/health", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/savings", savingsRoutes);
app.use("/api/v1/admin", adminRoutes);

export { app };
