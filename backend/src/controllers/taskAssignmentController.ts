import {
  assignUserToTask,
  unassignUserFromTask,
} from "../models/taskAssignment.js";
import { getTaskById } from "../models/task.js";
import type { AuthenticatedRequest } from "../types/models/auth.js";
import type { Response } from "express";

export async function assignUserToTaskController(
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const task_id = Number(req.params.id);
    const user_id = req.user.id;

    if (Number.isNaN(task_id)) {
      res.status(400).json({ error: "Invalid task id" });
      return;
    }

    const assignment = await assignUserToTask(user_id, task_id);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Error Assigning user to task" });
  }
}

export async function removeUserFromTaskController(
  req: AuthenticatedRequest<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const task_id = Number(req.params.id);
    const user_id = req.user.id;

    if (Number.isNaN(task_id)) {
      res.status(400).json({ error: "Invalid task id" });
      return;
    }

    // Check if the requesting user is the project owner
    const task = await getTaskById(task_id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // req.user.id comes from requireAuth middleware
    if (task.created_by !== req.user.id) {
      res
        .status(403)
        .json({ error: "Only the task owner can remove task assignees" });

      return;
    }

    const unassignment = await unassignUserFromTask(user_id, task_id);

    res.status(200).json(unassignment);
  } catch (err) {
    res.status(500).json({ error: "Error Removing user from task" });
  }
}
