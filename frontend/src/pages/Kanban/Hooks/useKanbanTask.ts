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
}
