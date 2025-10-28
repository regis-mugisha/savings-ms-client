import express from "express";
import { registerUser, loginUser, refreshUserToken, updatePushToken } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
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

const updatePushTokenSchema = Joi.object({
    pushToken: Joi.string().required(),
})

// Routes
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", validate(refreshTokenSchema), refreshUserToken);
router.post("/push-token", authenticate, validate(updatePushTokenSchema), updatePushToken);

export default router;