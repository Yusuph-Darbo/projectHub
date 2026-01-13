import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { assignUserToTaskController } from "../controllers/taskAssignmentController.js";

const router = express.Router();

router.post("/assign/:id", requireAuth, assignUserToTaskController);

export default router;
