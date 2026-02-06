import {
  addUserToProject,
  removeUserFromProject,
  getMembersOfProject,
} from "../models/projectAssignment.js";
import { getUserByEmailForAssignment } from "../models/user.js";
import { getProjectById } from "../models/project.js";
import type { Request, Response } from "express";

export async function addUserToProjectController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const project_id = Number(req.params.id);
    const email = String(req.body.email);

    if (!project_id) {
      res.status(400).json({ error: "Cannot find project" });
      return;
    }

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    // Search for user by email
    const user = await getUserByEmailForAssignment(email);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const assignment = await addUserToProject(user.user_id, project_id);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Assigning user to project" });
  }
}

export async function removeUserFromProjectController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const project_id = Number(req.params.id);
    const user_id = req.user.id;

    if (!project_id) {
      res.status(400).json({ error: "Cannot find project" });
      return;
    }

    if (!user_id) {
      res.status(400).json({ error: "user_id is required" });
      return;
    }

    // Check if the requesting user is the project owner
    const project = await getProjectById(project_id);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // req.user.id comes from requireAuth middleware
    if (project.owner_id !== req.user.id) {
      res
        .status(403)
        .json({ error: "Only the project owner can remove members" });

      return;
    }

    const unassignment = await removeUserFromProject(user_id, project_id);

    res.status(200).json(unassignment);
  } catch (err) {
    res.status(500).json({ error: "Unassigning user from project" });
  }
}

export async function getAllMembersOfProjectController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const project_id = Number(req.params.id);

    const users = await getMembersOfProject(project_id);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Getting users of project" });
  }
}
