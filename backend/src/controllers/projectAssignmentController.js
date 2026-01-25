import {
  addUserToProject,
  removeUserFromProject,
} from "../models/projectAssignment.js";

export async function addUserToProjectController(req, res) {
  try {
    const project_id = req.params.id;
    const { user_id } = req.body;

    if (!user_id || !user_id) {
      return res
        .status(400)
        .json({ error: "user_id and task_id are required" });
    }

    const assignment = await addUserToProject(user_id, project_id);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Assigning user to project" });
  }
}
