import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import Joi from "joi";
import validate from "../middlewares/validation.js";

const router = express.Router();

const registerSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    deviceId: Joi.string().required(),
})

router.post("/register", validate(registerSchema), registerUser);

export default router;