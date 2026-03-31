export const authorize = (...allowedRoles) => {
    // If first argument is an array, use it directly (backward compatibility)
    const rolesToCheck = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
    
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Case-insensitive role comparison
        const userRole = req.user.role?.toLowerCase();
        const roles = rolesToCheck.map(r => r.toLowerCase());

        if (userRole === 'root') {
            return next();
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${req.user.role} role does not have permission for this action.`
            });
        }

        next();
    };
};
