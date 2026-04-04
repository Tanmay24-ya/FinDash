import express from "express";
import { getUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getUsers);
router.put("/:id", protect, authorize("ADMIN"), updateUser);
router.delete("/:id", protect, authorize("ADMIN"), deleteUser);

export default router;
