import jwt from "jsonwebtoken";

// JWT AUTHENTICATION
export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Security clearance required. No session token." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, role }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Session expired or clearance revoked" });
    }
};

// ROLE-BASED ACCESS CONTROL (RBAC)
export const checkRole = (roles) => {
    return (req, res, next) => {
        // SYSTEM GUARDIAN BYPASS: Super Admin has unconditional clearance
        if (req.user.role === 'SUPER_ADMIN') {
            return next();
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access Denied: Your security clearance Level (${req.user.role}) is insufficient for this sector.` 
            });
        }
        next();
    };
};