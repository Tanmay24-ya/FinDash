import express from "express";
import { createRecord, getRecords, updateRecord, deleteRecord } from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("ADMIN", "ANALYST"),
    createRecord
);

router.get(
    "/",
    protect,
    authorize("ADMIN", "ANALYST", "VIEWER"),
    getRecords
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "ANALYST"),
  updateRecord
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteRecord
);

export default router;