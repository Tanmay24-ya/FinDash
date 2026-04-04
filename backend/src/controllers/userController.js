import prisma from "../config/db.js";

// GET ALL USERS (Admin / SuperAdmin Oversight)
export const getUsers = async (req, res) => {
    try {
        const executorRole = req.user.role;
        
        // SECURITY ARCHITECTURE: 
        // 1. SuperAdmin sees EVERYONE (including self and peer Supers)
        // 2. Admin sees everyone EXCEPT SuperAdmins
        const where = { isDeleted: false };
        if (executorRole !== 'SUPER_ADMIN') {
            where.role = { not: 'SUPER_ADMIN' };
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isEmailVerified: true,
                isActive: true,
                createdAt: true,
                createdBy: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// PROMOTE USER (Hierarchical)
export const promoteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role: targetRole } = req.body;
        const executorRole = req.user.role;

        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        // Governance Rules
        // 1. Cannot promote self
        if (targetUser.id === req.user.userId) {
            return res.status(403).json({ success: false, message: "Self-promotion denied" });
        }

        // 2. Only SuperAdmin can promote to ADMIN
        if (targetRole === 'ADMIN' && executorRole !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: "Only Super Admin can appoint Admins" });
        }

        // 3. Admin restrictions
        if (executorRole === 'ADMIN') {
            // Cannot touch peers (ADMIN/SUPER_ADMIN)
            if (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN') {
                return res.status(403).json({ success: false, message: "Insufficient clearance to manage peer administrators" });
            }
            // Cannot promote to ADMIN
            if (targetRole === 'ADMIN') {
                return res.status(403).json({ success: false, message: "Higher clearance required to appoint Admins" });
            }
        }

        const updateData = { role: targetRole, createdBy: req.user.userId };
        
        // "Admin can promote a viewer to analyst directly without email verification"
        // This means we treat the promotion as a manual verification
        if (targetRole === 'ANALYST' || targetRole === 'ADMIN' || targetRole === 'SUPER_ADMIN') {
            updateData.isEmailVerified = true;
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, message: `Identity escalated to ${targetRole}`, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Governance update failed" });
    }
};

// DEMOTE USER (Hierarchical)
export const demoteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role: targetRole } = req.body;
        const executorRole = req.user.role;

        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        if (targetUser.id === req.user.userId) return res.status(403).json({ success: false, message: "Self-demotion denied" });

        // Governance Rules
        // Admin cannot demote anyone if they are ADMIN or SUPER_ADMIN
        if (executorRole === 'ADMIN' && (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN')) {
            return res.status(403).json({ success: false, message: "Insufficient clearance to demote administrators" });
        }

        // Only SUPER_ADMIN can demote an ADMIN
        if (targetUser.role === 'ADMIN' && executorRole !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: "Only Super Admin can demote peer Admins" });
        }

        // Protect last Super Admin
        if (targetUser.role === 'SUPER_ADMIN') {
            const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
            if (superAdmins <= 1) return res.status(403).json({ success: false, message: "System failure: At least one Super Admin required" });
        }

        // SYSTEM RULE: Demoting to VIEWER strips verification status
        const updateData = { role: targetRole };
        if (targetRole === 'VIEWER') {
            updateData.isEmailVerified = false;
        } else {
            // Escalation to ANALYST/ADMIN/SUPER_ADMIN implies verification
            updateData.isEmailVerified = true;
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, message: `Identity reclassified to ${targetRole}`, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Demotion failed" });
    }
};

// DELETE USER (Hierarchical)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const executorRole = req.user.role;

        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        if (targetUser.id === req.user.userId) return res.status(403).json({ success: false, message: "Identity self-deletion protocol blocked" });

        // Admin restrictions: "cant kick the admin but can kick analyst and viewer"
        if (executorRole === 'ADMIN' && (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN')) {
            return res.status(403).json({ success: false, message: "Insufficient clearance to decommission administrators" });
        }

        // SuperAdmin protection
        if (targetUser.role === 'SUPER_ADMIN') {
             const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
             if (superAdmins <= 1) return res.status(403).json({ success: false, message: "Cannot delete the last Super Admin" });
        }

        await prisma.user.update({
            where: { id },
            data: { isDeleted: true, isActive: false }
        });

        res.json({ success: true, message: "User decommissioned successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Deletion failed" });
    }
};
