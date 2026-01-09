import { assignUserToTask } from "../models/taskAssignment.js";

export async function assignUserToTaskController(req, res) {
  try {
    const task_id = req.params.id;
    const { user_id } = req.body;

    if (!user_id || !task_id) {
      return res
        .status(400)
        .json({ error: "user_id and task_id are required" });
    }

    const assignment = await assignUserToTask(user_id, task_id);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Error Assigning user to task" });
  }
}
