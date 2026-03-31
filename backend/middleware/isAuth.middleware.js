import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication Token is missing"
            })
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user to get current role and details
        const user = await User.findById(verify.userId).select('-password -confirmPassword');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ success: false, message: "Account is not active" });
        }

        req.user = user;
        req.userId = verify.userId;
        next();

    } catch (error) {
        console.log(`Authentication Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: `Authentication Failed : ${error}`
        })

    }
}