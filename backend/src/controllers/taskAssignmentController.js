import {
  assignUserToTask,
  unassignUserFromTask,
} from "../models/taskAssignment.js";
import { getTaskById } from "../models/task.js";

export async function assignUserToTaskController(req, res) {
  try {
    const task_id = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user id is required" });
    }

    const assignment = await assignUserToTask(user_id, task_id);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Error Assigning user to task" });
  }
}

export async function removeUserFromTaskController(req, res) {
  try {
    const task_id = req.params.id;
    const { user_id } = req.body;

    // Check if the requesting user is the project owner
    const task = await getTaskById(task_id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // req.user.id comes from requireAuth middleware
    if (task.created_by !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only the project owner can remove task assignees" });
    }

    const unassignment = await unassignUserFromTask(user_id, task_id);

    res.status(200).json(unassignment);
  } catch (err) {
    res.status(500).json({ error: "Error Removing user from task" });
  }
}
