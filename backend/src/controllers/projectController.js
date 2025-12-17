import { use } from 'bcrypt/promises.js'
import {
    createProject,
    getProjectsByUserId,
    getProjectById
} from '../models/project.js'

export async function createProject(req, res) 
{
    try {
        const userId = req.user.id
        const { name, desc } = req.body

        const project = await createProject({
            name,
            desc,
            owner_id : userId
        })

        res.status(201).json(project)

    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}

export async function getMyProjects (req, res)
{
    try {
        const userId = req.user.id
        const project = await getProjectsByUserId(userId)

        res.status(201).json(project)
        
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}