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
    if (!projectId) return;
    if (!title.trim() || !description.trim()) return;

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
          const updatedTasks = await getProjectTasks(Number(projectId));
          setTasks(updatedTasks);
        }

        const refreshed = await getProjectTasks(Number(projectId));
        setTasks(refreshed);

        toast.success("Task updated");
        return;
      }

      // Update local state if only details/status changed
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((t) => (t.task_id === activeTask.id ? updatedTask! : t)),
        );
      }

      toast.success("Task updated");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to edit task:", err.message);
      }
      toast.error("Failed to edit task");
    } finally {
      setIsLoading(false);
    }
  }
}
