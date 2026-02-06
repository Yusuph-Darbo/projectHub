import {
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../models/task.js";
import type { Request, Response } from "express";
import type { CreateTask, Task } from "../types/task.js";

export async function createTaskController(
  req: Request<{ id: string }, any, CreateTask>,
  res: Response,
): Promise<void> {
  const { title, description } = req.body;
  const project_id = Number(req.params.id);

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
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
export async function getTask(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Getting task error" });
  }
}

export async function updateTaskController(
  req: Request<{ id: string }, any, Task>,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    const updatedTask = await updateTask(id, { title, description, status });

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Updating task" });
  }
}

export async function updateTaskStatusController(
  req: Request<{ id: string }, any, Task>,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const updatedTask = await updateTaskStatus(id, status);

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Updating task status" });
  }
}

export async function deleteTaskController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const deletedTask = await deleteTask(id);

    if (!deletedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ error: "Deleting task" });
  }
}
