import client from "../config/db.js";
import type { ProjectAssignment } from "../types/projectAssignment.js";

type PublicUser = {
  user_id: number;
  name: string;
};

export async function addUserToProject(
  user_id: number,
  project_id: number,
): Promise<ProjectAssignment> {
  try {
    const res = await client.query(
      `INSERT INTO project_member (user_id, project_id)
            VALUES ($1, $2)
            RETURNING *`,
      [user_id, project_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error assigning user to project:", err);
    throw err;
  }
}

export async function removeUserFromProject(
  user_id: number,
  project_id: number,
): Promise<ProjectAssignment | undefined> {
  try {
    const res = await client.query(
      `DELETE FROM project_member
            WHERE user_id = $1 AND project_id = $2
            RETURNING *`,
      [user_id, project_id],
    );

    return res.rows[0];
  } catch (err) {
    console.error("Error unassigning user from project:", err);
    throw err;
  }
}

// Get all members of a project
export async function getMembersOfProject(
  project_id: number,
): Promise<PublicUser[]> {
  try {
    const res = await client.query(
      `SELECT u.user_id, u.name
            FROM project_member pa
            JOIN users u ON pa.user_id = u.user_id
            WHERE pa.project_id = $1`,
      [project_id],
    );

    return res.rows;
  } catch (err) {
    console.error("Error getting members of project:", err);
    throw err;
  }
}

// Checks if user is a member of a project
export async function checkMembership(
  user_id: number,
  project_id: number,
): Promise<boolean> {
  try {
    const res = await client.query(
      `SELECT 1
             FROM project_member
             WHERE user_id = $1 AND project_id = $2`,
      [user_id, project_id],
    );

    // If row exists, user is a member
    // If TS thinks rowCount is null it will default to 0
    return (res.rowCount ?? 0) > 0;
  } catch (err) {
    console.error("Error checking membership:", err);
    throw err;
  }
}
