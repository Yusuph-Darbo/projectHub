import express from "express";
import authRoutes from "./routes/authRoute.js";
import projectRoutes from "./routes/projectRoute.js";
import taskRoutes from "./routes/taskRoute.js";
import taskAssignmentRoutes from "./routes/taskAssignmentRoute.js";
import dotenv from "dotenv";
import cors from "cors";

// Importing my jwt passkey from .env
// Have to run the app from backend folder due to relative pathing bruhh
dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/task-assignment", taskAssignmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
