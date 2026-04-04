import express from "express";
import { getSummary } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/summary",
    protect,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    getSummary
);

export default router;