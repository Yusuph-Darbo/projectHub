import { createTask, getTaskById } from "../models/task.js"

export async function createTaskController(req, res) {
    const { title, description, project_id } = req.body
    // comes from requireAuth middleware
    const userId = req.user.id   

    try {
        const task = await createTask({
            title,
            description,
            project_id,
            created_by : userId
        })

        res.status(201).json(task)

    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
    
}

export async function getTask(req, res) 
{
    try {
        const {id} = req.params

        const task = await getTaskById(id)

        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.status(200).json(task)

    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}