import express from "express";
import { protect, checkRole } from "../middleware/authMiddleware.js";
import { getUsers, promoteUser, demoteUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// ADMIN & SUPER_ADMIN Protected Routes
router.get("/", protect, checkRole(['ADMIN', 'SUPER_ADMIN']), getUsers);
router.put("/:id/promote", protect, checkRole(['ADMIN', 'SUPER_ADMIN']), promoteUser);
router.put("/:id/demote", protect, checkRole(['SUPER_ADMIN']), demoteUser); // Extra lock on demotion
router.delete("/:id", protect, checkRole(['ADMIN', 'SUPER_ADMIN']), deleteUser);

export default router;
