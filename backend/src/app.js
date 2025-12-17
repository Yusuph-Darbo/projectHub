import express from "express"
import authRoutes from './routes/authRoute.js'
import projectRoutes from './routes/projectRoute.js'
import taskRoutes from './routes/taskRoute.js'

const app = express()

app.use(express.json())

app.use('/api/auth')