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

// Routes
app.get("/api/v1", (req,res) => {
  res.send("Savings Management System API:v1")
})
app.get("/api/v1/health", (req,res) => {
  res.status(200).send("OK")
} )
app.use("/api/v1/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port 3000`);
});
