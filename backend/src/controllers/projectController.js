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

export async function createProjectController(req, res) {
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

export async function getMyProjectsController(req, res) {
  try {
    const userId = req.user.id;
    const project = await getProjectByUser(userId);

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: "Getting project" });
  }
}

export async function getAllTasksController(req, res) {
  try {
    const { id } = req.params;

    const tasks = await getAllTasksForProject(id);

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Getting tasks error" });
  }
}

export async function getProjectByIdController(req, res) {
  try {
    const { id } = req.params;

    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Getting project by ID" });
  }
}

export async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedProject = await updateProject(id, {
      name,
      description,
    });

    if (!updatedProject) {
      return res.status(400).json({ error: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: "Updating project" });
  }
}

export async function deleteProjectController(req, res) {
  try {
    const { id } = req.params;

    const deletedProject = await deleteProject(id);

    if (!deletedProject) {
      return res.status(400).json({ error: "Project not found" });
    }

    res.status(200).json(deletedProject);
  } catch (err) {
    res.status(500).json({ error: "Deleting project" });
  }
}

export async function getOwnerOfProjectController(req, res) {
  try {
    const { id } = req.params;

    const owner = await getOwnerOfProject(id);

    if (!owner) {
      return res.status(400).json({ error: "Project not found" });
    }

    res.status(201).json(owner);
  } catch (err) {
    res.status(500).json({ error: "Getting owner of project" });
  }
}
