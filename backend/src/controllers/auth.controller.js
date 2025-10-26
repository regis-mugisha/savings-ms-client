import { toUserDto } from "../dtos/user.dto.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt-utils.js";
import "dotenv/config";

export const registerUser = async (req, res) => {
    try {

        const { fullName, email, password, deviceId } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Decided to use bcrypt to hash the password instead of SHA512 which is vulnerable to rapid brute-force attacks due to its fast hashing speed.
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, password: hashedPassword, deviceId });

        const userDto = toUserDto(newUser);
        res.status(201).json({ message: "User created successfully", user: userDto });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error registering user: ${error.message}`);
        
    }

}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if device is verified (security check)
        if (!user.deviceVerified) {
            return res.status(403).json({ message: `Device not verified. Please contact admin(${process.env.ADMIN_EMAIL}).` });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const payload = { userId: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Get user data (without password)
        const userDto = toUserDto(user);

        // Return tokens and user data
        res.status(200).json({ 
            message: "Login successful",
            accessToken,
            refreshToken,
            user: userDto
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error logging in user: ${error.message}`);
    }
}

export const refreshUserToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }

        // Verify the refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user to ensure they still exist and are verified
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!user.deviceVerified) {
            return res.status(403).json({ message: "Device not verified" });
        }

        // Generate new access token
        const payload = { userId: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);

        res.status(200).json({ 
            message: "Token refreshed successfully",
            accessToken
        });

    } catch (error) {
        res.status(401).json({ message: error.message });
        console.log(`Error refreshing token: ${error.message}`);
    }
}