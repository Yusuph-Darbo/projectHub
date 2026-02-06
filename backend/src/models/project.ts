import client from "../config/db.js";
import type {
  CreateProject,
  Project,
  ProjectWithOwner,
  ProjectTask,
} from "../types/project.js";

// Updates are optional and cannot update user_id and created_at
type ProjectUpdates = Partial<
  Omit<Project, "user_id" | "created_at" | "owner_id">
>;

type ProjectOwner = {
  user_id: number;
  name: string;
};

export async function createProject({
  name,
  description,
  owner_id,
}: CreateProject): Promise<Project> {
  try {
    const res = await client.query(
      "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, owner_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error creating project:", err);
    throw err;
  }
}

export async function getProjectByUser(
  user_id: number,
): Promise<ProjectWithOwner[]> {
  try {
    const res = await client.query(
      `
      SELECT DISTINCT
        p.*,
        u.name AS owner_name
      FROM projects p
      JOIN users u
        ON p.owner_id = u.user_id
      LEFT JOIN project_member pm
        ON p.project_id = pm.project_id
      WHERE p.owner_id = $1 OR pm.user_id = $1
      `,
      [user_id],
    );

    return res.rows;
  } catch (err) {
    console.error("Error fetching projects for user:", err);
    throw err;
  }
}

// No need to for null as it will return a empty array
export async function getProjectByOwner(owner_id: number): Promise<Project[]> {
  try {
    const res = await client.query(
      "SELECT * FROM projects WHERE owner_id = $1",
      [owner_id],
    );

    return res.rows;
  } catch (err) {
    console.error("Error searching for project:", err);
    throw err;
  }
}

export async function getProjectById(
  project_id: number,
): Promise<Project | undefined> {
  try {
    const res = await client.query(
      "SELECT * FROM projects WHERE project_id = $1",
      [project_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error fetching project by id:", err);
    throw err;
  }
}

export async function getAllTasksForProject(
  project_id: number,
): Promise<ProjectTask[]> {
  try {
    const res = await client.query(
      `SELECT 
        t.task_id, 
        t.title, 
        t.description, 
        t.status, 
        t.created_by, 
        t.created_at, 
        t.updated_at,
        ta.user_id AS assigned_to
      FROM tasks t
      LEFT JOIN task_assignment ta ON t.task_id = ta.task_id
      WHERE t.project_id = $1`,
      [project_id],
    );

    return res.rows;
  } catch (err) {
    console.error("Error getting tasks for project:", err);
    throw err;
  }
}

export async function getOwnerOfProject(
  project_id: number,
): Promise<ProjectOwner | undefined> {
  try {
    const res = await client.query(
      `
      SELECT u.user_id, u.name
      FROM users u
      JOIN projects p
        ON p.owner_id = u.user_id
      WHERE p.project_id = $1
      `,
      [project_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error getting owner of project:", err);
    throw err;
  }
}

export async function updateProject(
  project_id: number,
  updates: ProjectUpdates,
): Promise<Project | null> {
  try {
    // Getting the update as an objet and filtering out the undefined entries
    const entries = Object.entries(updates).filter(
      ([_, value]) => value !== undefined,
    );

    // Checking for no updates
    if (entries.length === 0) return null;

    const setClause = entries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = entries.map(([_, value]) => value);
    values.push(project_id); // Add project_id for WHERE clause

    const res = await client.query(
      `UPDATE projects
            SET ${setClause}
            WHERE project_id = $${values.length}
            RETURNING *`,
      values,
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error updating project:", err);
    throw err;
  }
}

export async function deleteProject(
  project_id: number,
): Promise<Project | null> {
  try {
    const res = await client.query(
      "DELETE FROM projects WHERE project_id = $1 RETURNING *",
      [project_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error deleting project:", err);
    throw err;
  }
}
