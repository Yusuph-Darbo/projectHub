import {
  addUserToProject,
  removeUserFromProject,
  getMembersOfProject,
} from "../models/projectAssignment.js";
import { getUserByEmailForAssignment } from "../models/user.js";

export async function addUserToProjectController(req, res) {
  try {
    const project_id = req.params.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Search for user by email
    const user = await getUserByEmailForAssignment(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const assignment = await addUserToProject(user.user_id, project_id);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Assigning user to project" });
  }
}

export async function removeUserFromProjectController(req, res) {
  try {
    const project_id = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const unassignment = await removeUserFromProject(user_id, project_id);

    res.status(200).json(unassignment);
  } catch (err) {
    res.status(500).json({ error: "Unassigning user from project" });
  }
}

export async function getAllMembersOfProjectController(req, res) {
  try {
    const project_id = req.params.id;

    const users = await getMembersOfProject(project_id);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Getting users of project" });
  }
}
