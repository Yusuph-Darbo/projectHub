import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  assignUserToTaskController,
  removeUserFromTaskController,
} from "../controllers/taskAssignmentController.js";

const router = express.Router();

router.post("/:id/assign", requireAuth, assignUserToTaskController);
router.delete("/:id/unassign", requireAuth, removeUserFromTaskController);

export default router;
