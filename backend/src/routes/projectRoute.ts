import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createProjectController,
  getMyProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
  getAllTasksController,
  getOwnerOfProjectController,
} from "../controllers/projectController.js";
// A task has to be created from a project but every other task operation
// can be in the task route
import { createTaskController } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", requireAuth, createProjectController);
router.get("/", requireAuth, getMyProjectsController);
router.get("/:id", requireAuth, getProjectByIdController);
router.put("/:id", requireAuth, updateProjectController);
router.get("/:id/owner", requireAuth, getOwnerOfProjectController);
router.get("/:id/tasks", requireAuth, getAllTasksController);
router.post("/:id/tasks", requireAuth, createTaskController);
router.delete("/:id", requireAuth, deleteProjectController);

export default router;
