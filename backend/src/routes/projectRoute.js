import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createProjectController,
         getMyProjectsController,
         getProjectByIdController,
         updateProjectController,
         deleteProjectController 
        } from '../controllers/projectController.js'

const router = express.Router()

router.post('/', requireAuth, createProjectController)
router.get('/', requireAuth, getMyProjectsController)
router.get('/:id', requireAuth, getProjectByIdController)
router.put('/:id', requireAuth, updateProjectController)
router.delete('/:id', requireAuth, deleteProjectController)

export default router