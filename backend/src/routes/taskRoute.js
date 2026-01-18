import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getTask,
  updateTaskController,
  updateTaskStatusController,
  deleteTaskController,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/:id", requireAuth, getTask);
router.put("/:id", requireAuth, updateTaskController);
router.patch("/:id/status", requireAuth, updateTaskStatusController);
router.delete("/:id", requireAuth, deleteTaskController);

export default router;
