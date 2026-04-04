import prisma from "../config/db.js";

// GET ALL USERS (Admin / SuperAdmin)
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
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

        // 3. Admin cannot touch other Admins or Super Admins
        if (executorRole === 'ADMIN' && (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN')) {
            return res.status(403).json({ success: false, message: "Insufficient clearance to modify peer admins" });
        }

        const updated = await prisma.user.update({
            where: { id },
            data: { role: targetRole, createdBy: req.user.userId }
        });

        res.json({ success: true, message: `User promoted to ${targetRole}`, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Promotion failed" });
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

        // Governance Rules
        if (targetUser.id === req.user.userId) return res.status(403).json({ success: false, message: "Self-demotion denied" });

        // Only SUPER_ADMIN can demote an ADMIN
        if (targetUser.role === 'ADMIN' && executorRole !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: "Only Super Admin can demote Admins" });
        }

        // Protect last Super Admin
        if (targetUser.role === 'SUPER_ADMIN') {
            const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
            if (superAdmins <= 1) return res.status(403).json({ success: false, message: "System requires at least one Super Admin" });
        }

        const updated = await prisma.user.update({
            where: { id },
            data: { role: targetRole }
        });

        res.json({ success: true, message: `User demoted to ${targetRole}`, data: updated });
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

        if (targetUser.id === req.user.userId) return res.status(403).json({ success: false, message: "Self-deletion denied" });

        // Admin cannot delete other admins
        if (executorRole === 'ADMIN' && (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN')) {
            return res.status(403).json({ success: false, message: "Insufficient clearance to delete admins" });
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
