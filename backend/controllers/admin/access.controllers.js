import AccessRequest from '../../models/accessRequest.model.js';
import User from '../../models/auth.model.js';
import bcrypt from 'bcryptjs';
import { sendAccessRequestEmail, sendApprovalEmail } from '../../utils/email.utils.js';

export const getAllRequests = async (req, res) => {
    try {
        const requests = await AccessRequest.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, requests });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedRole, adminNotes } = req.body;

        const request = await AccessRequest.findById(id);
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Request already processed" });
        }

        // Check if user already exists (created during initial request)
        let user = await User.findOne({ email: request.email });
        let tempPassword = null;

        if (user) {
            // Update existing user status
            user.status = 'active';
            if (assignedRole || request.requestedRole) {
                user.role = assignedRole || request.requestedRole;
            }
            await user.save();
        } else {
            // Create New User if doesn't exist (fallback)
            tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            
            user = await User.create({
                fullName: request.fullName,
                email: request.email,
                password: hashedPassword,
                confirmPassword: hashedPassword,
                role: assignedRole || request.requestedRole,
                status: 'active'
            });
        }

        request.status = 'approved';
        request.adminNotes = adminNotes;
        await request.save();

        // Send Approval Email
        await sendApprovalEmail(request.email, request.fullName, tempPassword);

        return res.status(200).json({
            success: true,
            message: "Request approved and account activated",
            tempPassword: tempPassword // In production, this would only be in the email
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
