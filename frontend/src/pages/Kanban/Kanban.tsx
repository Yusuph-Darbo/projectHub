import "./Kanban.css";
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
import KanbanBoard from "./KanbanBoard.js";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth.js";
import type { Task, EnrichedTask } from "../../types/task.js";
import type { ProjectOwner } from "../../types/project.js";
import type { Member } from "../../types/projectAssignment.js";

type CardMode = null | "create" | "edit" | "memberCreate";

interface ColumnConfig {
  id: string;
  title: string;
  bgColor: string;
  borderColor: string;
  statusColor: string;
  statusTextColor: string;
}

interface Column extends ColumnConfig {
  tasks: EnrichedTask[];
  count: number;
}

export default function Kanban() {
  const [cardMode, setCardMode] = useState<CardMode>(null);
  const [activeTask, setActiveTask] = useState<EnrichedTask | null>(null);
  // const [activeDragTask, setActiveDragTask] = useState<EnrichedTask | null>(
  //   null,
  // );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("To Do");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignee, setAssignee] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [projectOwner, setProjectOwner] = useState<ProjectOwner | null>(null);

  const { projectId } = useParams<{ projectId: string }>();
  const currentUser = getCurrentUser();

  // Check if current user is the owner
  const isOwner =
    currentUser && projectOwner && currentUser.id === projectOwner.user_id;

  useEffect(() => {
    if (!projectId) return;

    async function fetchTasks() {
      try {
        const data = await getProjectTasks(Number(projectId));
        setTasks(data);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch tasks:", err.message);
        }
      }
    }

    fetchTasks();

    async function fetchMembers() {
      try {
        const member = await getMembersOfProject(Number(projectId));
        setMembers(member);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    }
    fetchMembers();

    async function fetchOwner() {
      try {
        const owner = await getProjectOwner(Number(projectId));
        setProjectOwner(owner);
      } catch (err) {
        console.error("Failed to fetch project owner:", err);
      }
    }
    fetchOwner();
  }, [projectId]);

  // cache the result of a calculation between re-renders.
  const userMap = useMemo(() => {
    const map: Record<number, string> = {};

    // Creating a dictionary / object between user_id and names
    members.forEach((m) => {
      map[m.user_id] = m.name;
    });

    if (projectOwner) {
      map[projectOwner.user_id] = projectOwner.name;
    }

    return map;
  }, [members, projectOwner]);

  const columnConfig: Record<string, ColumnConfig> = {
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

  function formatKanbanColumns(tasks: Task[]): Column[] {
    const columns: Column[] = Object.values(columnConfig).map((col) => ({
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
          assigned_to: task.assigned_to ?? null,
          // Derived display fields
          createdByLabel: userMap[task.created_by] ?? "Unknown user",
          assignedToLabel:
            task.assigned_to !== null && task.assigned_to !== undefined
              ? (userMap[task.assigned_to] ?? "Unknown user")
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
    if (!title.trim() || !description.trim() || !projectId) return;

    try {
      setIsLoading(true);

      const newTask = await createTask(Number(projectId), {
        title,
        description,
        status: "To Do",
      });

      // If assignee is selected, assign user to the newly created task
      if (assignee) {
        await handleTaskAssignment(newTask.task_id, Number(assignee));
      } else {
        // Just add the task to the list if no assignment
        setTasks((prev) => [newTask, ...prev]);
      }

      closeCard();

      toast.success("Created task successfully.");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create task:", err.message);
      }
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTask() {
    if (!activeTask) return;

    try {
      setIsLoading(true);

      await deleteTask(activeTask.id);

      // Filtering out the deleted task
      setTasks((prev) => prev.filter((t) => t.task_id !== activeTask.id));

      closeCard();

      toast.success("Successfully deleted task");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete task:", err.message);
      }
      toast.error("Failed to delete task. Try again");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateTask() {
    if (!activeTask || !projectId) return;

    const detailsChanged =
      title !== activeTask.title || description !== activeTask.description;

    const statusChanged = status !== activeTask.status;

    if (!title.trim() || !description.trim()) return;

    try {
      setIsLoading(true);

      let updatedTask: Task = {
        task_id: activeTask.id,
        project_id: Number(projectId),
        created_by: activeTask.created_by,
        title: activeTask.title,
        description: activeTask.description,
        status: activeTask.status,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (detailsChanged) {
        updatedTask = await editTask(activeTask.id, {
          title,
          description,
          status: activeTask.status,
        });
      }

      if (statusChanged) {
        updatedTask = await editTaskStatus(activeTask.id, status);
      }

      // Handle assignment/unassignment
      const assignmentChanged =
        assignee !== String(activeTask.assigned_to ?? "");
      if (assignmentChanged) {
        if (assignee) {
          // Assign user to task
          await handleTaskAssignment(activeTask.id, Number(assignee));
        } else if (activeTask.assigned_to) {
          // Unassign: remove current assignment
          await removeUserFromTask(activeTask.id, activeTask.assigned_to);
          const updatedTasks = await getProjectTasks(Number(projectId));
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
      if (err instanceof Error) {
        console.error("Failed to edit task:", err.message);
      }
      toast.error("Failed to edit task");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddMember() {
    if (!memberEmail.trim() || !projectId) return;

    try {
      setIsLoading(true);

      // Assign user to project by email
      await assignUserToProject(Number(projectId), memberEmail);

      // Re-fetch full member list so we get name, etc.
      const updatedMembers = await getMembersOfProject(Number(projectId));
      setMembers(updatedMembers);

      setMemberEmail("");
      closeCard();

      toast.success("Member added successfully.");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to add member to project:", err.message);
      }
      toast.error("Cannot find user.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveMember(user_id: number) {
    if (!projectId) return;

    try {
      setIsLoading(true);

      await removeUserFromProject(Number(projectId), user_id);

      setMembers((prev) => prev.filter((m) => m.user_id !== user_id));

      toast.success("Member removed successfully.");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to remove member from project:", err.message);
      }
      toast.error("Failed to remove user from project");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTaskAssignment(task_id: number, user_id: number) {
    if (!user_id || !projectId) return;

    try {
      await assignUserToTask(task_id, user_id);

      // Refetch tasks to get updated assignment data
      const updatedTasks = await getProjectTasks(Number(projectId));
      setTasks(updatedTasks);

      toast.success("User assigned to task successfully");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to assign member to task:", err.message);
      }
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

  function editCard(task: EnrichedTask) {
    setCardMode("edit");
    setActiveTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    // Pre-select current assignee by user ID, or empty if unassigned
    setAssignee(String(task.assigned_to ?? ""));
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
  const displayMembers: Member[] = projectOwner
    ? [
        projectOwner as Member,
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

      <KanbanBoard
        columns={columns}
        projectId={projectId!}
        onTasksUpdate={setTasks}
        onTaskClick={editCard}
      />

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
                        e.stopPropagation();
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
                  rows={4}
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
