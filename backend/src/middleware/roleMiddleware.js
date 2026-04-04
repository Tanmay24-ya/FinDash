export const authorize = (...roles) => {
    return (req, res, next) => {
        // SUPER_ADMIN Bypass: The highest clearance level has zero restrictions
        if (req.user.role === 'SUPER_ADMIN') {
            return next();
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Insufficient privilege for this operation",
            });
        }
        next();
    };
};