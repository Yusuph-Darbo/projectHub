import client from "../config/db.js";

export async function createProject({ name, description, owner_id }) {
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

export async function getProjectByUser(user_id) {
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

export async function getProjectByOwner(owner_id) {
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

export async function getProjectById(project_id) {
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

export async function getAllTasksForProject(project_id) {
  try {
    const res = await client.query(
      "SELECT task_id, title, description, status, created_at, updated_at from tasks where project_id = $1",
      [project_id],
    );

    return res.rows;
  } catch (err) {
    console.error("Error getting tasks for project:", err);
    throw err;
  }
}

export async function getOwnerOfProject(project_id) {
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

export async function updateProject(project_id, updates) {
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

export async function deleteProject(project_id) {
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
