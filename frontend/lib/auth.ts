export const ROLES = {
    ADMIN: 'Admin',
    ANALYST: 'Analyst',
    VIEWER: 'Viewer',
};

export const hasPermission = (userRole: string, requiredRole: string[]) => {
    return requiredRole.includes(userRole);
};

export const canEdit = (role: string) => role === ROLES.ADMIN;
export const canViewInsights = (role: string) => [ROLES.ADMIN, ROLES.ANALYST].includes(role);