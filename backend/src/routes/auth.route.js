import express from "express";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  updatePushToken,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Joi from "joi";
import validate from "../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

// Validation schemas
const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  deviceId: Joi.string().required(),
  pushToken: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updatePushTokenSchema = Joi.object({
  pushToken: Joi.string().required(),
});

// Routes
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, deviceId]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               deviceId: { type: string }
 *               pushToken: { type: string }
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post("/register", validate(registerSchema), registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
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
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Device not verified
 */
router.post("/login", validate(loginSchema), loginUser);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 accessToken: { type: string }
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", validate(refreshTokenSchema), refreshUserToken);

/**
 * @swagger
 * /api/v1/auth/push-token:
 *   post:
 *     summary: Update user's push notification token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pushToken]
 *             properties:
 *               pushToken: { type: string }
 *     responses:
 *       200:
 *         description: Push token updated successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/push-token",
  authenticate,
  validate(updatePushTokenSchema),
  updatePushToken
);

export default router;
