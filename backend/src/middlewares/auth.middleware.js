import { verifyAccessToken } from "../utils/jwt-utils.js";

// Middleware to protect routes - verifies access token
export const authenticate = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided. Authorization header must be: Bearer <token>' });
        }

        // Extract token (format: "Bearer <token>")
        const token = authHeader.substring(7);

        // Verify token
        const decoded = verifyAccessToken(token);
        
        // Attach user info to request
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

