import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createTaskController, getTask } from '../controllers/taskController.js'

const router = express.Router()

router.post('/', requireAuth, createTaskController)
router.get('/:id', requireAuth, getTask)

export default router