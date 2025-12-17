import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createProject, getMyProjects } from '../controllers/projectController.js'

const router = express.Router()

router.post('/', requireAuth, createProject)
router.get('/', requireAuth, getMyProjects)

export default router