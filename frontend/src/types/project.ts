export interface Project {
  project_id: number;
  name: string;
  description: string;
  owner_id: number;
  owner_name?: string; // 👈 optional
  created_at: Date;
}

export interface CreateProject {
  name: string;
  description: string;
}

export interface ProjectOwner {
  user_id: number;
  name: string;
}
