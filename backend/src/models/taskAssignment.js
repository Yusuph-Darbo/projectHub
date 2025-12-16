import client from '../config/db.js'

export async function assignUserToTask(user_id, task_id) 
{
    try {
        const res = await client.query(
            `INSERT INTO task_assignment (user_id, task_id)
            VALUES ($1, $2)
            RETURNING *`,
            [user_id, task_id]   
        )

        return res.rows[0]

    } catch (err) {
        console.error('Error assigning user to task:', err)
        throw err
    }
}

export async function unassignUserFromTask(user_id, task_id) 
{
    try {
        const res = await client.query(
            `DELETE FROM task_assignment
            WHERE user_id = $1 AND task_id = $2
            RETURNING *`,
            [user_id, task_id]   
        )

        return res.rows[0]

    } catch (err) {
        console.error('Error unassigning user from task:', err)
        throw err
    }
}

// Get all users assigned to a task
export async function getTasksUsers(task_id)
{
    try {
        const res = await client.query(
            `SELECT u.user_id, u.name, u.email
            FROM task_assignment ta
            JOIN users u ON ta.user_id = u.user_id
            WHERE ta.task_id = $1`,
            [task_id]   
        )

        return res.rows

    } catch (err) {
        console.error('Error getting users assigned to task:', err)
        throw err
    }
}

// List all tasks assigned to a user
export async function getUsersTasks(user_id)
{
    try {
        const res = await client.query(
            `SELECT t.task_id, t.title, t.description, t.status, t.created_at
            FROM task_assignment ta
            JOIN tasks t ON ta.task_id = t.task_id
            WHERE ta.user_id = $1`,
            [user_id]   
        )

        return res.rows

    } catch (err) {
        console.error('Error getting tasks assigned to user:', err)
        throw err
    }
}