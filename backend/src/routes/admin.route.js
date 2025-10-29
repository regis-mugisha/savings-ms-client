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
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       401:
 *         description: Invalid credentials
 */
const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
router.post("/login", validate(adminLoginSchema), adminLogin);

// Protected admin routes
router.use(authenticateAdmin);

/**
 * @swagger
 * /api/v1/admin/logout:
 *   post:
 *     summary: Admin logout (stateless)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", adminLogout);

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics payload
 */
router.get("/stats", dashboardStats);
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: List users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Users list
 */
router.get("/users", listUsers);
/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", getUserById);
/**
 * @swagger
 * /api/v1/admin/users/{userId}/verify-device:
 *   post:
 *     summary: Verify user's device
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User device verified
 *       404:
 *         description: User not found
 */
router.post("/users/:userId/verify-device", verifyUserDevice);
/**
 * @swagger
 * /api/v1/admin/transactions:
 *   get:
 *     summary: List transactions (optionally by user)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transactions list
 */
router.get("/transactions", listTransactions);

export default router;
