import express from "express";
import {
  getBalance,
  deposit,
  withdraw,
  getTransactionHistory,
} from "../controllers/savings.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Joi from "joi";
import validate from "../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Savings
 *   description: Savings operations
 */

// Validation schemas
const amountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

// All savings routes require authentication
router.use(authenticate);

// Routes
/**
 * @swagger
 * /api/v1/savings/balance:
 *   get:
 *     summary: Get current balance
 *     tags: [Savings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance: { type: number }
 *       401:
 *         description: Unauthorized
 */
router.get("/balance", getBalance);

/**
 * @swagger
 * /api/v1/savings/deposit:
 *   post:
 *     summary: Deposit amount
 *     tags: [Savings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number, minimum: 0.01 }
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/deposit", validate(amountSchema), deposit);

/**
 * @swagger
 * /api/v1/savings/withdraw:
 *   post:
 *     summary: Withdraw amount
 *     tags: [Savings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number, minimum: 0.01 }
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/withdraw", validate(amountSchema), withdraw);

/**
 * @swagger
 * /api/v1/savings/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Savings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Transaction' }
 *                 total: { type: integer }
 *                 totalPages: { type: integer }
 *                 currentPage: { type: integer }
 *       401:
 *         description: Unauthorized
 */
router.get("/history", getTransactionHistory);

export default router;
