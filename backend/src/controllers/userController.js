import prisma from "../config/db.js";
import { updateUserSchema } from "../utils/schemas.js";

// GET ALL USERS (ADMIN)
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// UPDATE USER (ADMIN)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const user = await prisma.user.findFirst({
        where: { id, isDeleted: false }
    })

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      message: "User updated successfully",
      user: {
        id: updated.id,
        name: updated.name,
        role: updated.role,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error updating user" });
  }
};

// SOFT DELETE USER (ADMIN)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting itself
    if (id === req.user.userId) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    const user = await prisma.user.findFirst({
        where: { id, isDeleted: false }
    })

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.update({
      where: { id },
      data: { isDeleted: true }
    });

    res.json({ message: "User deleted successfully (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
