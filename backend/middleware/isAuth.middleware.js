import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is not Found"
            })
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET);
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