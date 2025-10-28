import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { toUserDto } from "../dtos/user.dto.js";
import { sendPushNotification } from "../utils/push-notifications.js";

export const getBalance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            balance: user.balance,
            user: toUserDto(user)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error getting balance: ${error.message}`);
    }
};

export const deposit = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount. Must be greater than 0" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if device is verified
        if (!user.deviceVerified) {
            return res.status(403).json({ message: "Device not verified. Please contact admin." });
        }

        // Update balance
        const newBalance = user.balance + amount;
        user.balance = newBalance;
        await user.save();

        // Create transaction record
        const transaction = await Transaction.create({
            userId: user._id,
            type: 'deposit',
            amount: amount,
            balanceAfter: newBalance,
            description: `Deposit of $${amount}`
        });

        // Send push notification for successful deposit
        if (user.pushToken) {
            try {
                await sendPushNotification(
                    user.pushToken,
                    'Deposit Successful',
                    `You have successfully deposited $${amount.toFixed(2)}. Your new balance is $${newBalance.toFixed(2)}.`,
                    { type: 'deposit', amount, balance: newBalance }
                );
            } catch (error) {
                console.log(`Failed to send deposit notification: ${error.message}`);
            }
        }

        res.status(200).json({ 
            message: "Deposit successful",
            balance: newBalance,
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error depositing: ${error.message}`);
    }
};

export const withdraw = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount. Must be greater than 0" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if device is verified
        if (!user.deviceVerified) {
            return res.status(403).json({ message: "Device not verified. Please contact admin." });
        }

        // Check if user has sufficient balance
        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update balance
        const newBalance = user.balance - amount;
        user.balance = newBalance;
        await user.save();

        // Create transaction record
        const transaction = await Transaction.create({
            userId: user._id,
            type: 'withdraw',
            amount: amount,
            balanceAfter: newBalance,
            description: `Withdrawal of $${amount}`
        });

        // Send push notification for successful withdrawal
        if (user.pushToken) {
            try {
                await sendPushNotification(
                    user.pushToken,
                    'Withdrawal Successful',
                    `You have successfully withdrawn $${amount.toFixed(2)}. Your new balance is $${newBalance.toFixed(2)}.`,
                    { type: 'withdraw', amount, balance: newBalance }
                );
            } catch (error) {
                console.log(`Failed to send withdrawal notification: ${error.message}`);
            }
        }

        res.status(200).json({ 
            message: "Withdrawal successful",
            balance: newBalance,
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error withdrawing: ${error.message}`);
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 20 } = req.query;

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transaction.countDocuments({ userId });

        res.status(200).json({ 
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(`Error getting transaction history: ${error.message}`);
    }
};

