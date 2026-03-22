import User from '../../models/auth.model.js';
import ActivityLog from '../../models/activityLog.model.js';
import Role from '../../models/role.model.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users with filtering
export const getUsers = async (req, res) => {
    try {
        const { search, role, status } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role && role !== 'All Roles') {
            query.role = role.toLowerCase();
        }
        
        if (status && status !== 'All Status') {
            query.status = status.toLowerCase();
        }

        const users = await User.find(query).select('-password -confirmPassword').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin add user
export const adminAddUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword, role, status } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            role: role || 'staff',
            status: status || 'active'
        });

        // Log the activity
        await ActivityLog.create({
            userId: req.user._id,
            action: 'CREATE_USER',
            module: 'users',
            details: { newUser: newUser.fullName, role: newUser.role }
        });

        return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin update user
export const adminUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, role, status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, {
            fullName,
            email,
            phone,
            role,
            status
        }, { new: true }).select('-password -confirmPassword');

        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        // Log the activity
        await ActivityLog.create({
            userId: req.user._id,
            action: 'UPDATE_USER',
            module: 'users',
            details: { updatedUser: updatedUser.fullName, role: updatedUser.role }
        });

        return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Admin delete user
export const adminDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Log the activity
        await ActivityLog.create({
            userId: req.user._id,
            action: 'DELETE_USER',
            module: 'users',
            details: { deletedUser: user.fullName }
        });

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get audit logs with role-based filtering
export const getAuditLogs = async (req, res) => {
    try {
        const user = req.user;
        let query = {};

        // If not admin/root, filter logs
        if (user.role !== 'admin' && user.role !== 'root') {
            const userRole = await Role.findOne({ name: { $regex: new RegExp(`^${user.role}$`, 'i') } });
            
            if (!userRole) {
                // Return no logs if role not found
                return res.status(200).json({ success: true, logs: [] });
            }

            const allowedModules = [];
            const perms = userRole.permissions;

            if (perms.some(p => ['create_product', 'edit_product', 'delete_product', 'update_stock'].includes(p))) {
                allowedModules.push('inventory');
            }
            if (perms.includes('manage_users')) allowedModules.push('users', 'auth');
            if (perms.includes('manage_roles')) allowedModules.push('roles');
            if (perms.includes('view_reports')) allowedModules.push('reports');
            if (perms.includes('manage_suppliers')) allowedModules.push('suppliers');
            if (perms.includes('manage_orders')) allowedModules.push('orders');

            query.module = { $in: allowedModules };
        }

        const logs = await ActivityLog.find(query)
            .populate('userId', 'fullName role email')
            .sort({ createdAt: -1 })
            .limit(200);

        return res.status(200).json({ success: true, logs });
    } catch (error) {
        console.error("Audit Log Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
