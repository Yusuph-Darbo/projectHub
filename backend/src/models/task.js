import client from "../config/db.js";

export async function createTask({
  title,
  description,
  project_id,
  created_by,
}) {
  try {
    const res = await client.query(
      // Dont need to assign status as tasks are 'To Do' be default in DB
      "INSERT INTO tasks (title, description, project_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, project_id, created_by]
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
}

export async function getTaskById(task_id) {
  try {
    const res = await client.query("SELECT * FROM tasks where task_id = $1", [
      task_id,
    ]);

    return res.rows[0];
  } catch (err) {
    console.error("Error searching for task:", err);
    throw err;
  }
}

export async function updateTask(task_id, updates) {
  try {
    // Getting the update as an objet and filtering out the undefined entries
    const entries = Object.entries(updates).filter(
      ([_, value]) => value !== undefined
    );

    // Checking for no updates
    if (entries.length === 0) return null;

    const setClause = entries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = entries.map(([_, value]) => value);
    values.push(task_id); // Add task_id for WHERE clause

    const res = await client.query(
      `UPDATE tasks
            SET ${setClause}
            WHERE task_id = $${values.length}
            RETURNING *`,
      values
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
}

export async function updateTaskStatus(task_id, status) {
  try {
    const res = await client.query(
      `UPDATE tasks
             SET status = $1
             WHERE task_id = $2
             RETURNING *`,
      [status, task_id]
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
}

export async function deleteTask(task_id) {
  try {
    const res = await client.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING *",
      [task_id]
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
}
