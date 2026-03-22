import Role from "../models/role.model.js";
import Department from "../models/department.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Add a new role
// @route   POST /api/admin/roles/add
export const addRole = async (req, res) => {
    try {
        const { name, permissions, description } = req.body;
        const existingRole = await Role.findOne({ name });
        if (existingRole) return res.status(400).json({ success: false, message: "Role already exists" });

        const newRole = new Role({ name, permissions, description });
        await newRole.save();

        // Log activity
        await logActivity(req.user._id, `Created new role: ${name}`, 'roles', { roleId: newRole._id }, req.ip);

        res.status(201).json({ success: true, message: "Role created", role: newRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a role
// @route   PUT /api/admin/roles/update/:id
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions, description } = req.body;
        const role = await Role.findByIdAndUpdate(id, { name, permissions, description }, { new: true });
        if (!role) return res.status(404).json({ success: false, message: "Role not found" });

        // Log activity
        await logActivity(req.user._id, `Updated role: ${role.name}`, 'roles', { roleId: role._id }, req.ip);

        res.status(200).json({ success: true, message: "Role updated", role });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a role
// @route   DELETE /api/admin/roles/delete/:id
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);
        if (!role) return res.status(404).json({ success: false, message: "Role not found" });

        // Log activity
        await logActivity(req.user._id, `Deleted role: ${role.name}`, 'roles', { roleId: role._id }, req.ip);

        res.status(200).json({ success: true, message: "Role deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all roles
// @route   GET /api/admin/roles/all
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ success: true, roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new department
// @route   POST /api/admin/departments/add
export const addDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const existingDept = await Department.findOne({ name });
        if (existingDept) return res.status(400).json({ success: false, message: "Department already exists" });

        const newDept = new Department({ name, description });
        await newDept.save();

        // Log activity - Departments fall under 'roles/users' logic, but using 'roles' module
        await logActivity(req.user._id, `Created new department: ${name}`, 'roles', { deptId: newDept._id }, req.ip);

        res.status(201).json({ success: true, message: "Department created", department: newDept });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/admin/departments/all
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ success: true, departments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
