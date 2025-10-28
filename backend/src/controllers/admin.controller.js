import bcrypt from "bcrypt";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { generateAccessToken } from "../utils/jwt-utils.js";
import { sendPushNotification } from "../utils/push-notifications.js";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const payload = { adminId: admin._id, email: admin.email, isAdmin: true };
        const accessToken = generateAccessToken(payload);
        return res.status(200).json({ message: "Login successful", accessToken, admin: { _id: admin._id, fullName: admin.fullName, email: admin.email } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const listUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = "" } = req.query;
        const query = search
            ? { $or: [ { fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } } ] }
            : {};
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select("fullName email balance deviceVerified deviceId createdAt");
        const total = await User.countDocuments(query);
        return res.status(200).json({ users, total, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("fullName email balance deviceVerified deviceId createdAt");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const verifyUserDevice = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.deviceVerified = true;
        await user.save();
        // Send push notification if token exists
        if (user.pushToken) {
            try {
                await sendPushNotification(
                    user.pushToken,
                    'Device Verified',
                    'Your device has been verified. You can now log in and transact.',
                    { type: 'device_verified' }
                );
            } catch (e) {
                // Log and continue; do not fail the verification response due to push errors
                console.log(`Failed to send device verification notification: ${e.message}`);
            }
        }
        return res.status(200).json({ message: "User device verified", user: { _id: user._id, deviceVerified: user.deviceVerified } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const listTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, userId } = req.query;
        const filter = userId ? { userId } : {};
        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({ path: "userId", select: "fullName email" });
        const total = await Transaction.countDocuments(filter);
        return res.status(200).json({ transactions, total, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const dashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const verifiedUsers = await User.countDocuments({ deviceVerified: true });
        const totalBalanceAgg = await User.aggregate([{ $group: { _id: null, totalBalance: { $sum: "$balance" } } }]);
        const totalBalance = totalBalanceAgg[0]?.totalBalance || 0;
        const totalTransactions = await Transaction.countDocuments();
        return res.status(200).json({ totalUsers, verifiedUsers, totalBalance, totalTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


