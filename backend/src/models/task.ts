import client from "../config/db.js";
import type { CreateTask, Task } from "../types/models/task.js";

// Can only update title, description and / or status
type TaskUpdates = Partial<
  Omit<
    Task,
    "task_id" | "created_by" | "project_id" | "created_at" | "updated_at"
  >
>;

export async function createTask({
  title,
  description,
  project_id,
  created_by,
}: CreateTask): Promise<Task> {
  try {
    const res = await client.query(
      // Dont need to assign status as tasks are 'To Do' be default in DB
      "INSERT INTO tasks (title, description, project_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, project_id, created_by],
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
}

export async function getTaskById(task_id: number): Promise<Task | undefined> {
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

export async function updateTask(
  task_id: number,
  updates: TaskUpdates,
): Promise<Task | null> {
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

    const values: (string | number)[] = entries.map(([_, value]) => value);
    values.push(task_id); // Add task_id for WHERE clause

    const res = await client.query(
      `UPDATE tasks
            SET ${setClause}
            WHERE task_id = $${values.length}
            RETURNING *`,
      values,
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
}

// status only allows To Do, In Progress etc.
export async function updateTaskStatus(
  task_id: number,
  status: Task["status"],
): Promise<Task | undefined> {
  try {
    const res = await client.query(
      `UPDATE tasks
             SET status = $1
             WHERE task_id = $2
             RETURNING *`,
      [status, task_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
}

export async function deleteTask(task_id: number): Promise<Task | undefined> {
  try {
    // First, delete any task assignments to avoid foreign key constraint violation
    await client.query("DELETE FROM task_assignment WHERE task_id = $1", [
      task_id,
    ]);

    // Then delete the task itself
    const res = await client.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING *",
      [task_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
}
