import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.route.js";
import savingsRoutes from "./src/routes/savings.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import mongoSanitize from "express-mongo-sanitize";
import { seedAdmin } from "./src/utils/seed-admin.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.config.js";
import { client } from "./src/config/redis-client.config.js";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 6000;

await connectDB();
await seedAdmin();

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

app.use(mongoSanitize());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
