/**
 * Permission Matrix for InventPro RBAC
 * Maps capabilities to the associated user roles.
 */
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  STAFF: 'staff',
  SALES: 'sales',
  WAREHOUSE: 'warehouse staff', // Normalizing variations
  SALES_STAFF: 'sales staff',   // Normalizing variations
  ROOT: 'root'
};

export const PERMISSIONS = {
  CREATE_PRODUCT: 'create_product',
  DELETE_PRODUCT: 'delete_product',
  UPDATE_STOCK: 'update_stock',
  CREATE_ORDER: 'create_order',
  MANAGE_USERS: 'manage_users',
  VIEW_REPORTS: 'view_reports',
  MANAGE_VENDORS: 'manage_vendors',
  AUDIT_LOGS: 'audit_logs'
};

export const PERMISSION_MATRIX = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.AUDIT_LOGS
  ],
  [ROLES.ROOT]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.AUDIT_LOGS
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_VENDORS
  ],
  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.AUDIT_LOGS
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK
  ],
  [ROLES.WAREHOUSE]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.UPDATE_STOCK
  ],
  [ROLES.SALES]: [
    PERMISSIONS.CREATE_ORDER
  ],
  [ROLES.SALES_STAFF]: [
    PERMISSIONS.CREATE_ORDER
  ]
};

/**
 * Checks if a role has a specific permission.
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;
  constNormalizedRole = role.toLowerCase();
  const permissions = PERMISSION_MATRIX[constNormalizedRole] || [];
  return permissions.includes(permission);
};
