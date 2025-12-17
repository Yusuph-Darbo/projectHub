import {
    // Conflicting name with function below
    createProject as createProjectModel,
    getProjectByUser,
} from '../models/project.js'

export async function createProject(req, res) 
{
    try {
        const userId = req.user.id
        const { name, description } = req.body

        const project = await createProjectModel({
            name,
            description,
            owner_id : userId
        })

        res.status(200).json(project)

    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}

export async function getMyProjects (req, res)
{
    try {
        const userId = req.user.id
        const project = await getProjectByUser(userId)

        res.status(201).json(project)

    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}