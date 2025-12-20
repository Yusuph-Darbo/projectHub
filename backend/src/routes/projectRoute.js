import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createProjectController, getMyProjectsController, getProjectByIdController, updateProjectController } from '../controllers/projectController.js'

const router = express.Router()

router.post('/', requireAuth, createProjectController)
router.get('/', requireAuth, getMyProjectsController)
router.get('/:id', requireAuth, getProjectByIdController)
router.put('/:id', requireAuth, updateProjectController)

export default router