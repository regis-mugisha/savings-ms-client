import jwt from "jsonwebtoken";

// Generate Access Token (short-lived, for authentication)
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generate Refresh Token (long-lived, for getting new access tokens)
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

// Verify Access Token
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};