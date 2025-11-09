import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import RedisStore from "rate-limit-redis";
import swaggerUi from "swagger-ui-express";
import { client } from "./config/redis-client.config.js";
import { swaggerSpec } from "./config/swagger.config.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import savingsRoutes from "./routes/savings.route.js";

const app = express();

const redisClient = await client.connect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

app.use(limiter);
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://savings-ms-admin-panel.vercel.app",
    ],
    credentials: "true",
  })
);

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
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
