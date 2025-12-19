import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createTaskController, getTask, updateTaskController } from '../controllers/taskController.js'

const router = express.Router()

router.post('/', requireAuth, createTaskController)
router.get('/:id', requireAuth, getTask)
router.put('/:id', requireAuth, updateTaskController)

export default router