const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  const token = localStorage.getItem("token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// Don't need to explicitly state method as its GET by default
export async function getMe() {
  return apiRequest("/user/me");
}

export async function createProject(projectData) {
  return apiRequest("/project", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export async function editProject(projectId, data) {
  return apiRequest(`/project/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function listProjects() {
  return apiRequest("/project");
}

export async function getProjectOwner(projectId) {
  return apiRequest(`/project/${projectId}/owner`);
}

export async function deleteProject(projectId) {
  return apiRequest(`/project/${projectId}`, {
    method: "DELETE",
  });
}

export async function getProjectTasks(projectId) {
  return apiRequest(`/project/${projectId}/tasks`);
}

export async function createTask(projectId, data) {
  return apiRequest(`/project/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(taskId) {
  return apiRequest(`/task/${taskId}`, {
    method: "DELETE",
  });
}

export async function editTask(taskId, data) {
  return apiRequest(`/task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function editTaskStatus(taskId, status) {
  return apiRequest(`/task/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function assignUserToProject(project_id, email) {
  return apiRequest(`/projects/${project_id}/assign`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getMembersOfProject(project_id) {
  return apiRequest(`/projects/${project_id}`);
}
