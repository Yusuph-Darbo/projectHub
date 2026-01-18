import {
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../models/task.js";

export async function createTaskController(req, res) {
  const { title, description } = req.body;
  const project_id = req.params.id;
  // comes from requireAuth middleware
  const userId = req.user.id;

  try {
    const task = await createTask({
      title,
      description,
      project_id,
      created_by: userId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Create task error" });
  }
}

// Gets individual task
export async function getTask(req, res) {
  try {
    const { id } = req.params;

    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Getting task error" });
  }
}

export async function updateTaskController(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await updateTask(id, { title, description, status });

    res.status(200).json(updatedTask);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Updating task" });
  }
}

export async function updateTaskStatusController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await updateTaskStatus(id, { status });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Updating task status" });
  }
}

export async function deleteTaskController(req, res) {
  try {
    const { id } = req.params;

    const deletedTask = await deleteTask(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ error: "Deleting task" });
  }
}
