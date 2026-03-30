import { useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import { PERMISSION_MATRIX } from '../config/permissions';

/**
 * Custom hook to check user permissions based on their role.
 */
export const usePermission = () => {
  const user = useAppSelector(selectUser);
  const role = user?.role?.toLowerCase();

  const hasPermission = (permission) => {
    if (!role) return false;
    const permissions = PERMISSION_MATRIX[role] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!role) return false;
    const userPermissions = PERMISSION_MATRIX[role] || [];
    return permissions.some(p => userPermissions.includes(p));
  };

  const hasAllPermissions = (permissions) => {
    if (!role) return false;
    const userPermissions = PERMISSION_MATRIX[role] || [];
    return permissions.every(p => userPermissions.includes(p));
  };

  const hasRole = (requiredRole) => {
    if (!role) return false;
    return role === requiredRole.toLowerCase();
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    role,
    user
  };
};
