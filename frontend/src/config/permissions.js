/**
 * Permission Matrix for InventPro RBAC
 * Maps capabilities to the associated user roles.
 */
export const ROLES = {
  ROOT: 'root',
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  STAFF: 'staff',
  WAREHOUSE: 'warehouse staff',
  SALES_STAFF: 'sales staff',
};

export const PERMISSIONS = {
  // Level 4 - Admin Privileges
  MANAGE_USERS: 'manage_users',
  APPROVE_REQUESTS: 'approve_requests',
  FULL_AUDIT: 'full_audit',
  SYSTEM_SETTINGS: 'system_settings',

  // Level 3 - Operations
  PRODUCT_CRUD: 'product_crud',
  CATEGORY_CRUD: 'category_crud',
  VENDOR_REGISTRY: 'vendor_registry',
  SYSTEM_ANALYTICS: 'system_analytics',

  // Level 3 - Financial
  ADVANCED_REPORTS: 'advanced_reports',
  COST_AUDITING: 'cost_auditing',
  ORDER_HISTORY: 'order_history',

  // Level 2 - Execution
  STOCK_UPDATES: 'stock_updates',
  PROCUREMENT_TRACKING: 'procurement_tracking',
  INVENTORY_READ: 'inventory_read',

  // Level 2 - Commercial
  CREATE_SALES_ORDERS: 'create_sales_orders',
  SALES_METRICS: 'sales_metrics',
  PRODUCT_DISCOVERY: 'product_discovery'
};

export const PERMISSION_MATRIX = {
  [ROLES.ROOT]: Object.values(PERMISSIONS),
  
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS, PERMISSIONS.APPROVE_REQUESTS, PERMISSIONS.FULL_AUDIT, PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.PRODUCT_CRUD, PERMISSIONS.CATEGORY_CRUD, PERMISSIONS.VENDOR_REGISTRY, PERMISSIONS.SYSTEM_ANALYTICS,
    PERMISSIONS.ADVANCED_REPORTS, PERMISSIONS.COST_AUDITING, PERMISSIONS.ORDER_HISTORY,
    PERMISSIONS.STOCK_UPDATES, PERMISSIONS.PROCUREMENT_TRACKING, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.CREATE_SALES_ORDERS, PERMISSIONS.SALES_METRICS, PERMISSIONS.PRODUCT_DISCOVERY
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.PRODUCT_CRUD, PERMISSIONS.CATEGORY_CRUD, PERMISSIONS.VENDOR_REGISTRY, PERMISSIONS.SYSTEM_ANALYTICS,
    PERMISSIONS.STOCK_UPDATES, PERMISSIONS.PROCUREMENT_TRACKING, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.PRODUCT_DISCOVERY, // View Commercial
    PERMISSIONS.ORDER_HISTORY // Read-only Financial (subset)
  ],

  [ROLES.WAREHOUSE]: [
    PERMISSIONS.STOCK_UPDATES, PERMISSIONS.PROCUREMENT_TRACKING, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.PRODUCT_DISCOVERY // View Commercial
  ],

  [ROLES.SALES_STAFF]: [
    PERMISSIONS.CREATE_SALES_ORDERS, PERMISSIONS.SALES_METRICS, PERMISSIONS.PRODUCT_DISCOVERY,
    PERMISSIONS.INVENTORY_READ // Basic View Execution
  ],

  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.ADVANCED_REPORTS, PERMISSIONS.COST_AUDITING, PERMISSIONS.ORDER_HISTORY,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.VENDOR_REGISTRY // Read-only Operations
  ],

  [ROLES.STAFF]: [
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.PRODUCT_DISCOVERY
  ]
};

/**
 * Checks if a role has a specific permission.
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;
  const normalizedRole = role.toLowerCase();
  const permissions = PERMISSION_MATRIX[normalizedRole] || [];
  return permissions.includes(permission);
};
