import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.route.js";
import mongoSanitize from 'express-mongo-sanitize';

const app = express();
const PORT = process.env.PORT || 6000;

await connectDB();

app.use(mongoSanitize());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port 3000`);
});
