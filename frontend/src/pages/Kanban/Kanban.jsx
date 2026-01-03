import "./Kanban.css";
import { AiOutlineHolder } from "react-icons/ai";

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
import { useState } from "react";

export default function Kanban() {
  const [showCard, setCard] = useState(false);

  // Mock data
  const columns = [
    {
      id: "todo",
      title: "To Do",
      count: 2,
      bgColor: "#F9FAFC",
      borderColor: "#CAD5E2",
      tasks: [
        {
          id: 1,
          title: "Write API documentation",
          description: "Document all REST API endpoints with examples",
          status: "To Do",
          statusColor: "#F1F5F9",
          statusTextColor: "#324158",
        },
        {
          id: 2,
          title: "Setup CI/CD pipeline",
          description:
            "Configure GitHub Actions for automated testing and deployment",
          status: "To Do",
          statusColor: "#F1F5F9",
          statusTextColor: "#324158",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      count: 2,
      bgColor: "#EEF6FF",
      borderColor: "#8EC5FF",
      tasks: [
        {
          id: 3,
          title: "Design new landing page",
          description:
            "Create wireframes and mockups for the new landing page design",
          status: "In Progress",
          statusColor: "#DBEAFF",
          statusTextColor: "#1447E5",
        },
        {
          id: 4,
          title: "Implement user authentication",
          description: "Add login and signup functionality with JWT tokens",
          status: "In Progress",
          statusColor: "#DBEAFF",
          statusTextColor: "#1447E5",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      count: 2,
      bgColor: "#F0FDF4",
      borderColor: "#7AF1A8",
      tasks: [
        {
          id: 5,
          title: "Database schema design",
          description:
            "Design and implement the database schema for user profiles",
          status: "Done",
          statusColor: "#DCFCE6",
          statusTextColor: "#008236",
        },
        {
          id: 6,
          title: "Fix responsive layout issues",
          description:
            "Resolve mobile view layout problems on various screen sizes",
          status: "Done",
          statusColor: "#DCFCE6",
          statusTextColor: "#008236",
        },
      ],
    },
  ];

  function handleClick() {
    setCard((prev) => !prev);
  }

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
          <button className="create-project-btn" onClick={handleClick}>
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
                    onClick={handleClick}
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

      {showCard && (
        <>
          <div className="modal-overlay" onClick={handleClick}></div>
          <Card className="create-task-card">
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>
                Add a new task to your project. Give it a name and description
                to get started.
              </CardDescription>
              <CardAction>
                <button
                  className="close-btn"
                  onClick={handleClick}
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  placeholder="Enter task description"
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select className="form-status">
                  <option value="toDo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </CardContent>

            <CardFooter>
              <button className="btn-cancel" onClick={handleClick}>
                Cancel
              </button>
              <button className="btn-create" onClick={handleClick}>
                Create Task
              </button>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
