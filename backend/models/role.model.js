import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: String,
        enum: [
            'create_product', 
            'edit_product', 
            'delete_product', 
            'update_stock', 
            'manage_users', 
            'view_reports',
            'manage_roles',
            'manage_suppliers',
            'manage_orders'
        ]
    }],
    description: {
        type: String
    }
}, { timestamps: true });

const Role = mongoose.model("Role", RoleSchema);

export default Role;
