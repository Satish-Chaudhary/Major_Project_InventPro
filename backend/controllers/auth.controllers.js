import sendMail from '../config/Mail.js';
import { generateToken } from '../config/token.js';
import User from '../models/auth.model.js';
import AccessRequest from '../models/accessRequest.model.js';
import bcrypt from 'bcryptjs';
import { sendAccessRequestEmail, sendApprovalEmail, sendRejectionEmail } from '../utils/email.utils.js';
import { logActivity } from '../utils/logger.utils.js';
import { io } from "../socket/socket.js";
import ActivityLog from '../models/activityLog.model.js';
import mongoose from 'mongoose';
import Role from '../models/role.model.js';
import Setting from '../models/setting.model.js';

// Root User Registration (Only ONE root allowed)
export const registerRoot = async (req, res) => {
    try {
        const existingRoot = await User.findOne({ role: 'root' });
        if (existingRoot) {
            return res.status(403).json({
                success: false,
                message: "Root user already exists. Only one root user is allowed."
            });
        }

        const secretKey = req.headers['x-root-key'];
        if (secretKey !== process.env.ROOT_SECRET_KEY) {
            return res.status(401).json({
                success: false,
                message: "Invalid secret key"
            });
        }

        const { fullName, email, phone, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email or Phone already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        const rootUser = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            role: 'root',
            status: 'active'
        });

        return res.status(201).json({
            success: true,
            message: "Root user created successfully"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

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

        // Log activity (Manual ID as req.user is not yet available during first registration)
        const sysUser = await User.findOne({ email });
        if (sysUser) await logActivity(sysUser._id, `New Administrator Registered: ${fullName}`, 'auth', { email }, req.ip);

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

        // Log activity
        await logActivity(user._id, `Access Request Submitted: ${fullName}`, 'auth', { role: user.role }, req.ip);

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

import Session from '../models/session.model.js';

// Login Controller
export const logIn = async (req, res) => {
    try {
        const { email, password, loginType } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            await logActivity(null, `Failed login attempt (User not found)`, 'auth', { email }, req.ip);
            return res.status(400).json({
                success: false,
                message: 'User Not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            await logActivity(user._id, `Failed login attempt (Wrong password)`, 'auth', { email }, req.ip);
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        // ── Portal-role enforcement ──────────────────────────────────────────
        // Admin Portal ('admin' loginType) → only root and admin are allowed
        // Staff Portal ('staff' loginType) → only staff role is allowed
        const adminRoles = ['root', 'admin'];
        if (loginType === 'admin' && !adminRoles.includes(user.role)) {
            await logActivity(user._id, `Unauthorized portal access attempt (staff tried Admin Portal)`, 'auth', { email, role: user.role }, req.ip);
            return res.status(403).json({
                success: false,
                message: "Access Denied. Staff accounts must use the Staff Portal."
            });
        }
        if (loginType === 'staff' && adminRoles.includes(user.role)) {
            await logActivity(user._id, `Unauthorized portal access attempt (admin tried Staff Portal)`, 'auth', { email, role: user.role }, req.ip);
            return res.status(403).json({
                success: false,
                message: "Access Denied. Admin accounts must use the Admin Portal."
            });
        }
        // ────────────────────────────────────────────────────────────────────

        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: "Approval Pending"
            })
        }

        if (user.status === 'inactive') {
            return res.status(403).json({
                success: false,
                message: "Account Inactive"
            })
        }

        if (user.status === 'rejected') {
            return res.status(403).json({
                success: false,
                message: "Request Denied"
            })
        }

        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict"
        })

        // Create new session
        const userAgent = req.headers['user-agent'] || 'Unknown';
        
        // Expire old active sessions for this user (optional security best practice)
        await Session.updateMany({ userId: user._id, status: 'active' }, { status: 'expired', logoutAt: new Date() });

        const session = await Session.create({
            userId: user._id,
            ipAddress: req.ip,
            userAgent: userAgent,
            status: 'active',
            loginAt: new Date()
        });

        // Log activity
        await logActivity(user._id, `User logged in`, 'auth', { sessionId: session._id }, req.ip);

        // Fetch permissions for the role
        const roleData = await Role.findOne({ name: { $regex: new RegExp(`^${user.role}$`, 'i') } });
        const permissions = roleData ? roleData.permissions : [];

        return res.status(200).json({
            success: true,
            message: "User Login Successfully",
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status,
                permissions: permissions
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
        // Update session last activity
        if (req.user) {
             await Session.findOneAndUpdate({ userId: req.user._id, status: 'active' }, { lastActivity: new Date() }, { sort: { createdAt: -1 } });
        }

        const roleData = await Role.findOne({ name: { $regex: new RegExp(`^${req.user.role}$`, 'i') } });
        const userObj = req.user.toObject();
        userObj.permissions = roleData ? roleData.permissions : [];

        return res.status(200).json({
            success: true,
            user: userObj
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Logout Controoller

export const logout = async (req, res) => {
    try {
        // Log activity
        if (req.user) {
            await Session.findOneAndUpdate({ userId: req.user._id, status: 'active' }, { status: 'closed', logoutAt: new Date() }, { sort: { createdAt: -1 } });
            await logActivity(req.user._id, `User logged out`, 'auth', {}, req.ip);
        }

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

        // Implement cooling period (don't send more than once every 2 minutes)
        if (user.otpExpires && (user.otpExpires - Date.now() > 3 * 60 * 1000)) {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another OTP"
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.otpAttempts = 0; // Reset attempts

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

        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            })
        }

        if (user.otpAttempts >= 3) {
            return res.status(403).json({
                success: false,
                message: "Too many attempts. Request a new OTP."
            });
        }

        if (user.resetOtp !== otp) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        user.otpAttempts = 0;

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
        const { email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords Don't Match"
            });
        }

        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({
                success: false,
                message: "OTP Verification is required"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();

        // Log activity
        await logActivity(user._id, `Password reset successfully`, 'auth', {}, req.ip);

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
        const { assignedRole, adminNotes } = req.body || {};

        console.log(`Approving request for ID: ${id}, role: ${assignedRole}`);

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Update User info
        user.status = 'active';
        if (assignedRole) {
            user.role = assignedRole;
        }
        await user.save();

        // Sync AccessRequest status
        await AccessRequest.findOneAndUpdate(
            { email: user.email }, 
            { status: 'approved', adminNotes: adminNotes },
            { new: true }
        );

        // Send Approval Email
        await sendApprovalEmail(user.email, user.fullName);

        // Log activity - Admin approving the request
        await logActivity(req.user._id, `Approved access request for: ${user.fullName}`, 'auth', { targetUserId: user._id, role: user.role }, req.ip);

        // Emit real-time update
        io.emit("request:update", { id: user._id, status: 'active', email: user.email });
        io.to("role:admin").to("role:root").emit("notification:new", {
            type: 'auth',
            title: 'User Approved',
            message: `${user.fullName} has been approved as ${user.role}.`
        });

        return res.status(200).json({
            success: true,
            message: `User ${user.fullName} approved successfully as ${user.role}.`
        });
    } catch (error) {
        console.error("Approve Request Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Reject a request
export const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        console.log(`Rejecting request for ID: ${id}, reason: ${reason}`);

        const user = await User.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Sync AccessRequest status
        await AccessRequest.findOneAndUpdate({ email: user.email }, { status: 'rejected' });

        // Send Rejection Email
        await sendRejectionEmail(user.email, user.fullName, reason);

        // Log activity - Admin rejecting the request
        await logActivity(req.user._id, `Rejected access request for: ${user.fullName}`, 'auth', { targetUserId: user._id, reason }, req.ip);

        // Emit real-time update
        io.emit("request:update", { id: user._id, status: 'rejected', email: user.email });
        io.to("role:admin").to("role:root").emit("notification:new", {
            type: 'auth',
            title: 'User Rejected',
            message: `${user.fullName}'s access request was rejected.`
        });

        return res.status(200).json({
            success: true,
            message: `User ${user.fullName} request rejected.`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Update Current User Profile
export const updateMe = async (req, res) => {
    try {
        const { fullName, phone } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;

        await user.save();

        // Log activity
        await logActivity(user._id, `Updated profile information`, 'users', { updatedFields: req.body }, req.ip);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- Security Audit Controllers ---

export const getSecuritySummary = async (req, res) => {
    try {
        const activeSessions = await Session.find({ status: 'active' })
            .populate('userId', 'fullName email role')
            .sort({ lastActivity: -1 })
            .limit(10);

        const recentFailed = await ActivityLog.find({ 
            module: 'auth', 
            action: { $regex: /failed/i } 
        }).populate('userId', 'fullName email role').sort({ createdAt: -1 }).limit(10);
        
        const settings = await Setting.findOne() || {};
        
        return res.status(200).json({
            success: true,
            activeSessions,
            recentFailed,
            settings
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
