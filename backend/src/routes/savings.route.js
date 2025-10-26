import express from "express";
import { 
    getBalance, 
    deposit, 
    withdraw, 
    getTransactionHistory 
} from "../controllers/savings.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Joi from "joi";
import validate from "../middlewares/validation.js";

const router = express.Router();

// Validation schemas
const amountSchema = Joi.object({
    amount: Joi.number().positive().required(),
});

// All savings routes require authentication
router.use(authenticate);

// Routes
router.get("/balance", getBalance);
router.post("/deposit", validate(amountSchema), deposit);
router.post("/withdraw", validate(amountSchema), withdraw);
router.get("/history", getTransactionHistory);

export default router;

