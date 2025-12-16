import client from '../config/db.js'

export async function createTask (project_id, title, description)
{
    try {
        const res = await client.query(
            // Dont need to assign status as tasks are 'To Do' be default in DB
            'INSERT INTO tasks (project_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [project_id, title, description]
        )
        return res.rows[0]

    } catch (err) {
        console.error('Error creating task:', err)
        throw err
    }
}

export async function getTaskById (task_id)
{
    try {
        const res = await client.query(
            'SELECT * FROM tasks where task_id = $1',
            [task_id]
    )

        return res.rows[0]
    } catch (err) {
        console.error('Error searching for task:', err)
        throw err
    }
}

export async function updateTask (task_id, updates)
{
    try {
        const keys = Object.keys(updates)
        if (keys.length === 0) return null // Nothing to update

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')
        const values = Object.values(updates)
        values.push(task_id) // Add task_id for WHERE clause



        const res = await client.query(
            `UPDATE tasks
            SET ${setClause}
            WHERE task_id = $${values.length}
            RETURNING *`,
            [...values]
    )
        return res.rows[0]
    
    } catch (err) {
        console.error('Error updating task:', err)
        throw err
    }
}

export async function updateTaskStatus(task_id, status)
{
    try {
        const res = await client.query(
            `UPDATE tasks
             SET status = $1
             WHERE task_id = $2
             RETURNING *`,
             [status, task_id]
        )

        return res.rows[0]

    } catch (err) {
        console.error('Error updating task:', err)
        throw err
    } 
}

export async function deleteTask (task_id)
{
    try {
        const res = await client.query(
            'DELETE FROM tasks WHERE task_id = $1 RETURNING *',
            [task_id]
        )

        return res.rows[0]

    } catch (err) {
        console.error('Error deleting task:', err)
        throw err
    }

}