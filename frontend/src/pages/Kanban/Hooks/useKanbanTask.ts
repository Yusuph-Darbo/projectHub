import { useState, useEffect, useMemo } from "react";
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
} from "../../../utils/api.js";
import { getCurrentUser } from "../../../utils/auth.js";
import type { Task, EnrichedTask } from "../../../types/task.js";
import type { ProjectOwner } from "../../../types/project.js";
import type { Member } from "../../../types/projectAssignment.js";
import { toast } from "sonner";

interface Column {
  id: string;
  title: string;
  bgColor: string;
  borderColor: string;
  statusColor: string;
  statusTextColor: string;
  tasks: EnrichedTask[];
  count: number;
}

export default function useKanbanTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [projectOwner, setProjectOwner] = useState<ProjectOwner | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentUser = getCurrentUser();

  const isOwner =
    currentUser && projectOwner && currentUser.id === projectOwner.user_id;

  // Fetching
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

  // UserMap
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

  // Column Config
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

  const columns: Column[] = useMemo(() => {
    const cols: Column[] = Object.values(columnConfig).map((col) => ({
      ...col,
      tasks: [],
      count: 0,
    }));

    tasks.forEach((task) => {
      const column = cols.find((c) => c.title === task.status);
      if (!column) return;

      column.tasks.push({
        // Preserve original fields so we keep IDs
        id: task.task_id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_by: task.created_by,
        assigned_to: task.assigned_to ?? null,
        // Derived display fields
        createdByLabel: userMap[task.created_by] ?? "Unknown user",
        assignedToLabel:
          task.assigned_to != null
            ? (userMap[task.assigned_to] ?? "Unknown user")
            : "Unassigned",
        statusColor: column.statusColor,
        statusTextColor: column.statusTextColor,
      });

      column.count++;
    });

    return cols;
  }, [tasks, userMap]);

  // Task actions
  async function createNewTask(data: { title: string; description: string }) {
    if (!projectId) return;

    try {
      setIsLoading(true);

      const newTask = await createTask(Number(projectId), {
        ...data,
        status: "To Do",
      });

      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create task:", err.message);
      }
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateExistingTask({
    activeTask,
    title,
    description,
    status,
    assignee,
  }: {
    activeTask: EnrichedTask;
    title: string;
    description: string;
    status: string;
    assignee: string;
  }) {
    if (!projectId) return false;
    if (!title.trim() || !description.trim()) return false;

    try {
      const detailsChanged =
        title !== activeTask.title || description !== activeTask.description;

      const statusChanged = status !== activeTask.status;

      const assignmentChanged =
        assignee !== String(activeTask.assigned_to ?? "");

      let updatedTask: Task | null = null;

      //  If details was changed
      if (detailsChanged) {
        updatedTask = await editTask(activeTask.id, {
          title,
          description,
          status: activeTask.status,
        });
      }

      // If status was changed
      if (statusChanged) {
        updatedTask = await editTaskStatus(activeTask.id, status);
      }

      // If assignment was changed
      if (assignmentChanged) {
        if (assignee) {
          await assignUserToTask(activeTask.id, Number(assignee));
        } else if (activeTask.assigned_to) {
          await removeUserFromTask(activeTask.id, activeTask.assigned_to);
        }
      }

      const refreshed = await getProjectTasks(Number(projectId));
      setTasks(refreshed);

      toast.success("Task updated");
      return true;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to edit task:", err.message);
      }
      toast.error("Failed to edit task");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateTaskStatus(taskId: number, newStatus: string) {
    try {
      await editTaskStatus(taskId, newStatus);
      const updated = await getProjectTasks(Number(projectId));
      setTasks(updated);
      return true;
    } catch {
      return false;
    }
  }

  async function refreshTasks() {
    const data = await getProjectTasks(Number(projectId));
    setTasks(data);
  }

  async function deleteExistingTask(taskId: number) {
    try {
      setIsLoading(true);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  }

  async function addNewMember(email: string) {
    if (!projectId) return;

    try {
      setIsLoading(true);

      // Assign user to project by email
      await assignUserToProject(Number(projectId), email);

      // Re-fetch full member list so we get name, etc.
      const updatedMembers = await getMembersOfProject(Number(projectId));
      setMembers(updatedMembers);

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

  async function removeMember(userId: number) {
    if (!projectId) return;

    try {
      setIsLoading(true);
      await removeUserFromProject(Number(projectId), userId);
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to remove member from project:", err.message);
      }
      toast.error("Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  }

  const displayMembers: Member[] = projectOwner
    ? [
        projectOwner as Member,
        ...members.filter((m) => m.user_id !== projectOwner.user_id),
      ]
    : members;

  return {
    columns,
    members,
    displayMembers,
    isOwner,
    isLoading,
    createNewTask,
    updateExistingTask,
    deleteExistingTask,
    updateTaskStatus,
    addNewMember,
    removeMember,
    refreshTasks,
  };
}
