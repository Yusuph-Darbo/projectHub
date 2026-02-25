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
}
