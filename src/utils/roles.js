// User role constants
export const ROLES = {
    VIEWER: 'viewer',
    CREATOR: 'creator',
    ADMIN: 'admin'
};

// Check if user has required role
export const hasRole = (userRole, requiredRole) => {
    const roleHierarchy = {
        [ROLES.VIEWER]: 0,
        [ROLES.CREATOR]: 1,
        [ROLES.ADMIN]: 2
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Check if user is creator or admin
export const isCreator = (userRole) => {
    return userRole === ROLES.CREATOR || userRole === ROLES.ADMIN;
};

// Check if user is admin
export const isAdmin = (userRole) => {
    return userRole === ROLES.ADMIN;
};
