import sendMail from '../config/Mail.js';
import { generateToken } from '../config/token.js';
import User from '../models/auth.model.js';
import AccessRequest from '../models/accessRequest.model.js';
import bcrypt from 'bcryptjs';
import { sendAccessRequestEmail, sendApprovalEmail } from '../utils/email.utils.js';

// Admin Registration Controller (Max 2 Admins)
export const adminRegister = async (req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword } = req.body;

        // 1. Check if 2 admins already exist
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount >= 2) {
            return res.status(403).json({
                success: false,
                message: "System already has maximum number of administrators (2). No further admin registration allowed."
            });
        }

        // 2. Basic validations
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // 3. Check uniqueness
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email or Phone number already associated with an account" 
            });
        }

        // 4. Create Admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            role: 'admin',
            status: 'active' // Admins are active by default
        });

        return res.status(201).json({
            success: true,
            message: "Administrator registered successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Request Access Controller
export const requestAccess = async (req, res) => {
    try {
        const { email, fullName, password, confirmPassword, role } = req.body;

        const findByEmail = await User.findOne({ email });

        if (findByEmail) {
            return res.status(400).json({
                success: false,
                message: "Email Already Exists"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password length should be at least 8 characters"
            })
        }

        if (!(password === confirmPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password doesn't Match"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        const user = await User.create({
            fullName,
            email,
            role: role || 'staff',
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            status: 'pending'
        })

        // Also create a record in AccessRequest collection as per new requirement
        await AccessRequest.create({
            fullName,
            email,
            requestedRole: role || 'staff',
            status: 'pending'
        });

        // Send confirmation emails to user and admin
        await sendAccessRequestEmail(email, fullName, user.role);

        return res.status(200).json({
            success: true,
            message: "Access Request Sent Successfully. Waiting for Admin Approval."
        })

    } catch (error) {
        console.log(`Request Access Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
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

        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: "Your account is pending approval."
            })
        }

        if (user.status === 'rejected') {
            return res.status(403).json({
                success: false,
                message: "Your account request has been rejected."
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
            message: "User Login Successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(`Login Error : ${error}`);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get Current User Profile
export const getMe = async (req, res) => {
    try {
        // req.user is attached by authMiddleware
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Logout Controoller

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
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


// --- Admin Role Request System Controllers ---

// Get all pending requests
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await User.find({ status: { $in: ['pending', 'approved', 'rejected'] } }).select('-password -confirmPassword');
        return res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Approve a request
export const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { status: 'active' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Sync AccessRequest status
        await AccessRequest.findOneAndUpdate({ email: user.email }, { status: 'approved' });

        // Send Approval Email
        await sendApprovalEmail(user.email, user.fullName);

        return res.status(200).json({
            success: true,
            message: `User ${user.fullName} approved successfully.`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Reject a request
export const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Sync AccessRequest status
        await AccessRequest.findOneAndUpdate({ email: user.email }, { status: 'rejected' });

        return res.status(200).json({
            success: true,
            message: `User ${user.fullName} request rejected.`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

