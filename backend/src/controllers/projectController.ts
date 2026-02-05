import {
  createProject,
  getProjectByUser,
  getProjectById,
  updateProject,
  deleteProject,
  getAllTasksForProject,
  getOwnerOfProject,
} from "../models/project.js";
import { addUserToProject } from "../models/projectAssignment.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/models/auth.js";
import type { Project } from "../types/models/project.js";

export async function createProjectController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    const project = await createProject({
      name,
      description,
      owner_id: userId,
    });

    // Automatically add the creator as a member of the project
    await addUserToProject(userId, project.project_id);

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Creating project" });
  }
}

export async function getMyProjectsController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const userId = req.user.id;
    const project = await getProjectByUser(userId);

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Getting project" });
  }
}

export async function getAllTasksController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }

    const tasks = await getAllTasksForProject(id);

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Getting tasks error" });
  }
}

export async function getProjectByIdController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }

    const project = await getProjectById(id);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Getting project by ID" });
  }
}

export async function updateProjectController(
  req: AuthenticatedRequest<{ id: string }, any, Project>,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }

    const updatedProject = await updateProject(id, {
      name,
      description,
    });

    if (!updatedProject) {
      res.status(400).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: "Updating project" });
  }
}

export async function deleteProjectController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }

    const deletedProject = await deleteProject(id);

    if (!deletedProject) {
      res.status(400).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(deletedProject);
  } catch (err) {
    res.status(500).json({ error: "Deleting project" });
  }
}

export async function getOwnerOfProjectController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid project id" });
      return;
    }

    const owner = await getOwnerOfProject(id);

    if (!owner) {
      res.status(400).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(owner);
  } catch (err) {
    res.status(500).json({ error: "Getting owner of project" });
  }
}
