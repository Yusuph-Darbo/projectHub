import type { Task, CreateTask } from "../types/task.js";
import type { TaskAssignment } from "../types/taskAssignment.js";
import type { Project, CreateProject, ProjectOwner } from "../types/project.js";
import type { ProjectAssignment } from "../types/projectAssignment.js";
import type {
  CreateUser,
  RegisterBody,
  LoginBody,
  AuthenticatedUser,
} from "../types/user.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  const token = localStorage.getItem("token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = (await response.json()) as T;

    if (!response.ok) {
      throw new Error(
        (data as any)?.error ?? `HTTP error! status: ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(
  userData: RegisterBody,
): Promise<CreateUser> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(
  credentials: LoginBody,
): Promise<AuthenticatedUser> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// Don't need to explicitly state method as its GET by default
export async function getMe(): Promise<RegisterBody> {
  return apiRequest("/user/me");
}

export async function createProject(
  projectData: CreateProject,
): Promise<Project> {
  return apiRequest("/project", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export async function editProject(
  projectId: number,
  data: CreateProject,
): Promise<Project> {
  return apiRequest(`/project/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function listProjects(): Promise<Project[]> {
  return apiRequest("/project");
}

export async function getProjectOwner(
  projectId: number,
): Promise<ProjectOwner> {
  return apiRequest(`/project/${projectId}/owner`);
}

export async function deleteProject(projectId: number): Promise<Project> {
  return apiRequest(`/project/${projectId}`, {
    method: "DELETE",
  });
}

export async function getProjectTasks(projectId: number): Promise<Task[]> {
  return apiRequest(`/project/${projectId}/tasks`);
}

export async function createTask(
  projectId: number,
  data: CreateTask,
): Promise<Task> {
  return apiRequest(`/project/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(taskId: number): Promise<Task> {
  return apiRequest(`/task/${taskId}`, {
    method: "DELETE",
  });
}

export async function editTask(
  taskId: number,
  data: CreateTask,
): Promise<Task> {
  return apiRequest(`/task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function editTaskStatus(
  taskId: number,
  status: string,
): Promise<Task> {
  return apiRequest(`/task/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function assignUserToProject(
  project_id: number,
  email: string,
): Promise<ProjectAssignment> {
  return apiRequest(`/projects/${project_id}/assign`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getMembersOfProject(
  project_id: number,
): Promise<Project> {
  return apiRequest(`/projects/${project_id}`);
}

export async function removeUserFromProject(
  project_id: number,
  user_id: number,
): Promise<TaskAssignment> {
  return apiRequest(`/projects/${project_id}/unassign`, {
    method: "DELETE",
    body: JSON.stringify({ user_id }),
  });
}

export async function assignUserToTask(
  task_id: number,
  user_id: number,
): Promise<TaskAssignment> {
  return apiRequest(`/task-assignment/${task_id}/assign`, {
    method: "POST",
    body: JSON.stringify({ user_id }),
  });
}

export async function removeUserFromTask(
  task_id: number,
  user_id: number,
): Promise<Task> {
  return apiRequest(`/task-assignment/${task_id}/unassign`, {
    method: "DELETE",
    body: JSON.stringify({ user_id }),
  });
}
