export interface CreateProject {
  name: string;
  description: string;
  owner_id: number;
}

export interface Project {
  project_id: number;
  name: string;
  description: string;
  owner_id: number;
  created_at: Date;
}

// All of the properties of project + owner_name
export type ProjectWithOwner = Project & {
  owner_name: string;
};

export interface ProjectTask {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  assigned_to: number | null;
}
