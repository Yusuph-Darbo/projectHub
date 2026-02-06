export interface CreateTask {
  title: string;
  description: string;
  project_id: number;
  created_by: number;
}

export interface Task {
  task_id: number;
  project_id: number;
  created_by: number;
  title: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
