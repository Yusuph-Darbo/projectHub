import "./Kanban.css";
import { AiOutlineHolder } from "react-icons/ai";
import { getProjectTasks, createTask } from "../../utils/api.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Kanban() {
  // Has 3 modes = null || "create" || "edit"
  const [cardMode, setCardMode] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [title, setTitle] = useState(
    cardMode === "edit" && activeTask ? activeTask.title : ""
  );
  const [description, setDescription] = useState(
    cardMode === "edit" && activeTask ? activeTask.description : ""
  );
  const { projectId } = useParams(); // grabs projectId from URL
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      if (!projectId) return;
      try {
        const data = await getProjectTasks(Number(projectId));
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err.message);
      }
    }

    fetchTasks();
  }, [projectId]);

  const columnConfig = {
    "To Do": {
      id: "todo",
      title: "To Do",
      bgColor: "#F9FAFC",
      borderColor: "#CAD5E2",
      statusColor: "#F1F5F9",
      statusTextColor: "#324158",
    },
    "In Progress": {
      id: "in-progress",
      title: "In Progress",
      bgColor: "#EEF6FF",
      borderColor: "#8EC5FF",
      statusColor: "#DBEAFF",
      statusTextColor: "#1447E5",
    },
    Done: {
      id: "done",
      title: "Done",
      bgColor: "#F0FDF4",
      borderColor: "#7AF1A8",
      statusColor: "#DCFCE6",
      statusTextColor: "#008236",
    },
  };

  function formatKanbanColumns(tasks) {
    const columns = Object.values(columnConfig).map((col) => ({
      ...col,
      tasks: [],
      count: 0,
    }));

    tasks.forEach((task) => {
      const column = columns.find((col) => col.title === task.status);

      if (column) {
        column.tasks.push({
          id: task.task_id,
          title: task.title,
          description: task.description,
          status: task.status,
          statusColor: column.statusColor,
          statusTextColor: column.statusTextColor,
        });

        column.count++;
      }
    });

    return columns;
  }

  async function handleCreateTask() {
    if (!title.trim() || !description.trim()) return;

    try {
      const newTask = await createTask(projectId, {
        title,
        description,
      });

      setTasks((prev) => [newTask, ...prev]);

      closeCard();
    } catch (err) {
      console.error("Failed to create task:", err.message);
    }
  }

  // The data formatted
  const columns = formatKanbanColumns(tasks);

  function createCard() {
    setCardMode("create");
    setActiveTask(null);
  }

  function editCard(project) {
    setCardMode("edit");
    setActiveTask(project);
  }

  function closeCard() {
    setCardMode(null);
    setActiveTask(null);
  }

  // Helper function to get status value for select
  function getStatusValue(status) {
    if (status === "To Do") return "toDo";
    if (status === "In Progress") return "inProgress";
    if (status === "Done") return "done";
    return "toDo";
  }

  // When creating a form checking if the user has inputted text
  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <>
      <div className="home-container">
        <div className="home-header">
          <div className="header-left">
            <h1>My Tasks</h1>
            <p>
              {columns.reduce((total, col) => total + col.count, 0)}{" "}
              {columns.reduce((total, col) => total + col.count, 0) === 1
                ? "task"
                : "tasks"}{" "}
              in total
            </p>
          </div>
          <button className="create-project-btn" onClick={createCard}>
            <FaPlus />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      <div className="kanban-container">
        <div className="kanban-board">
          {columns.map((column) => (
            <div
              key={column.id}
              className="kanban-column"
              style={{
                backgroundColor: column.bgColor,
                border: `2px solid ${column.borderColor}`,
              }}
            >
              <div className="column-header">
                <h2 className="column-title">{column.title}</h2>
                <span className="column-count">{column.count}</span>
              </div>
              <div className="column-content">
                {column.tasks.map((task) => (
                  <button
                    key={task.id}
                    className="task-card"
                    onClick={() => editCard(task)}
                  >
                    <div className="task-header">
                      <AiOutlineHolder className="task-icon" />
                      <h3 className="task-title">{task.title}</h3>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <span
                      className="task-status"
                      style={{
                        backgroundColor: task.statusColor,
                        color: task.statusTextColor,
                        border: `1px solid ${column.borderColor}`,
                      }}
                    >
                      {task.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {cardMode && (
        <>
          <div className="modal-overlay" onClick={closeCard}></div>
          <Card className="create-task-card">
            <CardHeader>
              {cardMode === "create" && (
                <>
                  <CardTitle>Create New Task</CardTitle>
                  <CardDescription>
                    Add a new task to your project. Give it a name and
                    description to get started.
                  </CardDescription>
                </>
              )}

              {cardMode === "edit" && activeTask && (
                <>
                  <CardTitle>Edit Task</CardTitle>
                  <CardDescription>
                    Update the task details below.
                  </CardDescription>
                </>
              )}

              <CardAction>
                <button
                  className="close-btn"
                  onClick={closeCard}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <div className="form-group">
                <label htmlFor="task-name">Task Name</label>
                <input
                  type="text"
                  id="task-name"
                  placeholder="Enter task name"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  placeholder="Enter task description"
                  className="form-textarea"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-status"
                  defaultValue={
                    cardMode === "edit" && activeTask
                      ? getStatusValue(activeTask.status)
                      : "toDo"
                  }
                >
                  <option value="toDo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </CardContent>

            <CardFooter>
              {cardMode === "edit" && activeTask && (
                <button className="btn-delete" onClick={closeCard}>
                  Delete task
                </button>
              )}

              <div>
                <button className="btn-cancel" onClick={closeCard}>
                  Cancel
                </button>
                <button
                  className="btn-create"
                  onClick={handleCreateTask}
                  disabled={!isFormValid}
                >
                  {cardMode === "create" ? "Create Task" : "Update Task"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
