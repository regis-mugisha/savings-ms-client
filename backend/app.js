import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.config.js";

const app = express();
const PORT = process.env.PORT || 6000;

connectDB();


app.listen(PORT, () => {
  console.log(`Server is running on port 3000`);
});
