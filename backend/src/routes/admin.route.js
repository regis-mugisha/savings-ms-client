import express from "express";
import Joi from "joi";
import validate from "../middlewares/validation.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import {
  adminLogin,
  adminLogout,
  listUsers,
  getUserById,
  verifyUserDevice,
  listTransactions,
  dashboardStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Public: Admin login
const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
router.post("/login", validate(adminLoginSchema), adminLogin);

// Protected admin routes
router.use(authenticateAdmin);

router.post("/logout", adminLogout);

router.get("/stats", dashboardStats);
router.get("/users", listUsers);
router.get("/users/:userId", getUserById);
router.post("/users/:userId/verify-device", verifyUserDevice);
router.get("/transactions", listTransactions);

export default router;
