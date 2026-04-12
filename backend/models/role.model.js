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
            'manage_users',
            'approve_requests',
            'full_audit',
            'system_settings',
            'product_crud',
            'category_crud',
            'vendor_registry',
            'system_analytics',
            'advanced_reports',
            'cost_auditing',
            'order_history',
            'stock_updates',
            'procurement_tracking',
            'inventory_read',
            'create_sales_orders',
            'sales_metrics',
            'product_discovery'
        ]
    }],
    description: {
        type: String
    }
}, { timestamps: true });

const Role = mongoose.model("Role", RoleSchema);

export default Role;
