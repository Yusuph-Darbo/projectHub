import "./Kanban.css";
import { AiOutlineHolder } from "react-icons/ai";
import { RiDeleteBin2Line } from "react-icons/ri";
import {
  getProjectTasks,
  createTask,
  deleteTask,
  editTask,
  editTaskStatus,
  getMembersOfProject,
  assignUserToProject,
  getProjectOwner,
  removeUserFromProject,
  assignUserToTask,
  removeUserFromTask,
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
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth.js";

export default function Kanban() {
  // Has 3 modes = null || "create" || "edit" || "memberCreate"
  const [cardMode, setCardMode] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [assignee, setAssignee] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [projectOwner, setProjectOwner] = useState(null);

  const { projectId } = useParams(); // grabs projectId from URL
  const currentUser = getCurrentUser();

  // Check if current user is the owner
  const isOwner =
    currentUser && projectOwner && currentUser.id === projectOwner.user_id;

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

    async function fetchOwner() {
      try {
        const owner = await getProjectOwner(projectId); // { user_id, name }
        setProjectOwner(owner);
      } catch (err) {
        console.error("Failed to fetch project owner:", err);
      }
    }
    fetchOwner();
  }, [projectId]);

  // cache the result of a calculation between re-renders.
  const userMap = useMemo(() => {
    const map = {};

    // Creating a dictionary / object between user_id and names
    members.forEach((m) => {
      map[m.user_id] = m.name;
    });

    if (projectOwner) {
      map[projectOwner.user_id] = projectOwner.name;
    }

    return map;
  }, [members, projectOwner]);

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
          // Preserve original fields so we keep IDs
          title: task.title,
          description: task.description,
          status: task.status,
          created_by: task.created_by,
          assigned_to: task.assigned_to,
          // Derived display fields
          createdByLabel: userMap[task.created_by] ?? "Unknown user",
          assignedToLabel: task.assigned_to
            ? userMap[task.assigned_to]
            : "Unassigned",
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

      // If assignee is selected, assign user to the newly created task
      if (assignee) {
        await handleTaskAssignment(newTask.task_id, assignee);
      } else {
        // Just add the task to the list if no assignment
        setTasks((prev) => [newTask, ...prev]);
      }

      closeCard();

      toast.success("Created task successfully.");
    } catch (err) {
      console.error("Failed to create task:", err.message);
      toast.error("Failed to create task");
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

      toast.success("Successfully deleted task");
    } catch (err) {
      console.error("Failed to delete task:", err.message);
      toast.error("Failed to delete task. Try again");
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

      // Handle assignment/unassignment
      const assignmentChanged = assignee !== (activeTask.assigned_to ?? "");
      if (assignmentChanged) {
        if (assignee) {
          // Assign user to task
          await handleTaskAssignment(activeTask.id, assignee);
        } else if (activeTask.assigned_to) {
          // Unassign: remove current assignment
          await removeUserFromTask(activeTask.id, activeTask.assigned_to);
          const updatedTasks = await getProjectTasks(projectId);
          setTasks(updatedTasks);
        }
      } else {
        // Only update task list if assignment didn't change
        setTasks((prev) =>
          prev.map((t) => (t.task_id === activeTask.id ? updatedTask : t)),
        );
      }

      closeCard();
    } catch (err) {
      console.error("Failed to edit task:", err.message);
      toast.error("Failed to edit task");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddMember() {
    if (!memberEmail.trim()) return;

    try {
      setIsLoading(true);

      // Assign user to project by email
      await assignUserToProject(projectId, memberEmail);

      // Re-fetch full member list so we get name, etc.
      const updatedMembers = await getMembersOfProject(projectId);
      setMembers(updatedMembers);

      setMemberEmail("");
      closeCard();

      toast.success("Member added successfully.");
    } catch (err) {
      console.error("Failed to add member to project:", err.message);
      toast.error("Cannot find user.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveMember(user_id) {
    try {
      setIsLoading(true);

      await removeUserFromProject(projectId, user_id);

      setMembers((prev) => prev.filter((m) => m.user_id !== user_id));

      toast.success("Member removed successfully.");
    } catch (err) {
      console.error("Failed to remove member from project:", err.message);
      toast.error("Failed to remove user from project");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTaskAssignment(task_id, user_id) {
    if (!user_id) return;

    try {
      await assignUserToTask(task_id, user_id);

      // Refetch tasks to get updated assignment data
      const updatedTasks = await getProjectTasks(projectId);
      setTasks(updatedTasks);

      toast.success("User assigned to task successfully");
    } catch (err) {
      console.error("Failed to assign member to task:", err.message);
      toast.error("Failed to assign user to task");
      throw err; // Re-throw so handleUpdateTask can catch it
    }
  }

  // The data formatted
  const columns = formatKanbanColumns(tasks);

  function createCard() {
    setCardMode("create");
    setActiveTask(null);
    setTitle("");
    setDescription("");
    setStatus("To Do");
    setAssignee("");
  }

  function editCard(task) {
    setCardMode("edit");
    setActiveTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    // Pre-select current assignee by user ID, or empty if unassigned
    setAssignee(task.assigned_to ?? "");
  }

  function closeCard() {
    setCardMode(null);
    setActiveTask(null);
  }

  function createMemberCard() {
    setMemberEmail("");
    setCardMode("memberCreate");
  }

  // When creating a form checking if the user has inputted text
  const isFormValid = title.trim().length > 0 && description.trim().length > 0;
  const isMemberFormValid = memberEmail.trim().length > 0;
  const displayMembers = projectOwner
    ? [
        projectOwner,
        ...members.filter((m) => m.user_id !== projectOwner.user_id),
      ]
    : members;

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

                    <div className="task-footer">
                      <div className="task-status-row">
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
                      </div>

                      <div className="task-meta">
                        <p>Created by: {task.createdByLabel}</p>
                        {task.assignedToLabel !== "Unassigned" && (
                          <p className="task-assignee">
                            Assigned to: {task.assignedToLabel}
                          </p>
                        )}
                      </div>
                    </div>
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
          {isOwner && (
            <button className="create-project-btn" onClick={createMemberCard}>
              <FaPlus />
              <span>Add member</span>
            </button>
          )}
        </div>
      </div>

      <div className="kanban-container">
        <div className="members-grid">
          {displayMembers.map((member) => {
            const isMemberOwner =
              projectOwner && member.user_id === projectOwner.user_id;
            const isYou = currentUser && member.user_id === currentUser.id;

            return (
              <div key={member.user_id} className="member-card">
                <div className="member-header">
                  <h3 className="member-name">
                    {member.name}
                    {isYou ? " (You)" : ""}
                  </h3>
                  {isOwner && !isMemberOwner && (
                    <RiDeleteBin2Line
                      className="bin-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent button click
                        handleRemoveMember(member.user_id);
                      }}
                    />
                  )}
                </div>
                <p className="member-role">
                  {isMemberOwner ? "Owner" : "Team Member"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {(cardMode === "create" || cardMode === "edit") && (
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

              {cardMode === "edit" && (
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

                  <label htmlFor="task-assignment">Assign member to task</label>
                  <select
                    id="task-assignment"
                    className="form-status"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    <option value="">Unassigned</option>

                    {displayMembers.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.name}
                        {currentUser?.id === member.user_id ? " (You)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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

      {cardMode === "memberCreate" && (
        <>
          <div className="modal-overlay" onClick={closeCard}></div>
          <Card className="create-task-card">
            <CardHeader>
              <CardTitle>Add new member</CardTitle>
              <CardDescription>
                Add a new member to your project. Enter their email and they
                will be apart of this project
              </CardDescription>

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
                <label htmlFor="task-name">Member email</label>
                <input
                  type="text"
                  id="member-email"
                  placeholder="Enter member email"
                  className="form-input"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <div>
                <button className="btn-cancel" onClick={closeCard}>
                  Cancel
                </button>
                <button
                  className="btn-create"
                  disabled={!isMemberFormValid}
                  onClick={handleAddMember}
                >
                  {isLoading ? "Saving..." : "Add member"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
