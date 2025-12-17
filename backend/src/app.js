import express from "express"
import authRoutes from './routes/authRoute.js'
import projectRoutes from './routes/projectRoute.js'
import taskRoutes from './routes/taskRoute.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/task', taskRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})