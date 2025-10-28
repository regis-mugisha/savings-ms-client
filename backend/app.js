import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.route.js";
import savingsRoutes from "./src/routes/savings.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import mongoSanitize from "express-mongo-sanitize";
import { seedAdmin } from "./src/utils/seed-admin.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 6000;

await connectDB();
await seedAdmin();

app.use(
  cors({
    origin: ["https://savings-ms-admin-panel.vercel.app"],
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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/savings", savingsRoutes);
app.use("/api/v1/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
