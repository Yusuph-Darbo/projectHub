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

interface column {
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
}
