import express from "express";
import { registerUser, loginUser, refreshUserToken } from "../controllers/auth.controller.js";
import Joi from "joi";
import validate from "../middlewares/validation.js";

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    deviceId: Joi.string().required(),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

// Routes
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", validate(refreshTokenSchema), refreshUserToken);

export default router;