import "./Kanban.css";
import { AiOutlineHolder } from "react-icons/ai";
import {
  getProjectTasks,
  createTask,
  deleteTask,
  editTask,
  editTaskStatus,
  getMembersOfProject,
} from "../../utils/api.js";
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const { projectId } = useParams(); // grabs projectId from URL

  useEffect(() => {
    if (!projectId) return;

    async function fetchTasks() {
      try {
        const data = await getProjectTasks(projectId);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err.message);
      }
    }

    fetchTasks();

    async function fetchMembers() {
      try {
        const members = await getMembersOfProject(projectId);
        setMembers(members);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    }
    fetchMembers();
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
      setIsLoading(true);

      const newTask = await createTask(projectId, {
        title,
        description,
      });

      setTasks((prev) => [newTask, ...prev]);

      closeCard();
    } catch (err) {
      console.error("Failed to create task:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTask() {
    try {
      setIsLoading(true);

      await deleteTask(activeTask.id);

      // Filtering out the deleted task
      setTasks((prev) => prev.filter((t) => t.task_id !== activeTask.id));

      closeCard();
    } catch (err) {
      console.error("Failed to delete task:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateTask() {
    if (!activeTask) return;

    const detailsChanged =
      title !== activeTask.title || description !== activeTask.description;

    const statusChanged = status !== activeTask.status;

    if (!title.trim() || !description.trim()) return;

    try {
      setIsLoading(true);

      let updatedTask = activeTask;

      if (detailsChanged) {
        updatedTask = await editTask(activeTask.id, {
          title,
          description,
        });
      }

      if (statusChanged) {
        updatedTask = await editTaskStatus(activeTask.id, status);
      }

      // Rendering the updated task list
      setTasks((prev) =>
        prev.map((t) => (t.task_id === activeTask.id ? updatedTask : t)),
      );

      closeCard();
    } catch (err) {
      console.error("Failed to edit task:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // The data formatted
  const columns = formatKanbanColumns(tasks);

  function createCard() {
    setCardMode("create");
    setActiveTask(null);
    setTitle("");
    setDescription("");
  }

  function editCard(task) {
    setCardMode("edit");
    setActiveTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  }

  function closeCard() {
    setCardMode(null);
    setActiveTask(null);
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

      <div className="home-container">
        <div className="home-header">
          <div className="home-left">
            <h1>Team members</h1>
            <p>
              {members.length} {members.length === 1 ? "member" : "members"} on
              this project
            </p>
          </div>
          <button className="create-project-btn">
            <FaPlus />
            <span>Add member</span>
          </button>
        </div>
      </div>

      <div className="kanban-container">
        <div className="members-grid">
          {members.map((member) => (
            <div key={member.user_id} className="member-card">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">Team Member</p>
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
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </CardContent>

            <CardFooter>
              {cardMode === "edit" && activeTask && (
                <button className="btn-delete" onClick={handleDeleteTask}>
                  Delete task
                </button>
              )}

              <div>
                <button className="btn-cancel" onClick={closeCard}>
                  Cancel
                </button>
                <button
                  className="btn-create"
                  disabled={!isFormValid}
                  onClick={
                    cardMode === "edit" ? handleUpdateTask : handleCreateTask
                  }
                >
                  {isLoading
                    ? "Saving..."
                    : cardMode === "edit"
                      ? "Update Task"
                      : "Create Task"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
