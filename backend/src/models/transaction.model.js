import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['deposit', 'withdraw'], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0 
    },
    balanceAfter: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);

