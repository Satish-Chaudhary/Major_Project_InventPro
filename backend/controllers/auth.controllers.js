import sendMail from '../config/Mail.js';
import { generateToken } from '../config/token.js';
import User from '../models/auth.model.js';
import bcrypt from 'bcryptjs';


// Request Access Controller
export const requestAccess = async (req, res) => {
    try {
        const { email, fullName, password, department, } = req.body;

        const findByEmail = await User.findOne({ email });

        if (findByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email Already Exists"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: true,
                message: "Password length should be at least 8 characters"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            department,
            password: hashedPassword
        })

        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        })

        return res.status(200).json({
            success: true,
            message: "Send Request Successfully"
        })

    } catch (error) {
        console.log(`Request Access Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

// Login Controller
export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User Not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        })

        return res.status(200).json({
            success: true,
            message: "User Login Successfully"
        })

    } catch (error) {
        console.log(`Login Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Logout Controoller

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(300).json({
            success: true,
            message: "User Logout Successfully"
        })

    } catch (error) {
        console.log(`Logout Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Forgot Password - Send OTP Controller
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendMail(email, otp);

        return res.status(200).json({
            success: true,
            message: "Email SuccessFully Send"
        })

    } catch (error) {
        console.log(`Send Otp Error : ${error.message}`);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


// Forgot Password - Verify OTP Controller
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or Expire Otp"
            })
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();
        return res.status(200).json({
            success: true,
            message: "Otp Verified Successfully"
        })

    } catch (error) {
        console.log(`Verify Otp Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


// Forgot Password - Reset Password Controller
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({
                success: false,
                message: "Otp Verification is required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })
    } catch (error) {
        console.log(`Reset Password Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

