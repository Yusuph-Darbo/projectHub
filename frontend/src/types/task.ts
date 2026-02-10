export interface Task {
  task_id: number;
  project_id: number;
  created_by: number;
  title: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  assigned_to?: number | null;
}

export interface EnrichedTask {
  id: number;
  title: string;
  description: string;
  status: string;
  created_by: number;
  assigned_to: number | null;
  createdByLabel: string;
  assignedToLabel: string;
  statusColor: string;
  statusTextColor: string;
}

export interface CreateTask {
  title: string;
  description: string;
  status: string;
}

export interface KanbanTask {
  id: number;
  title: string;
  description: string;
  status: Task["status"];
  created_by: number;
  assigned_to: number | null;
  createdByLabel: string;
  assignedToLabel: string;
  statusColor: string;
  statusTextColor: string;
}

export interface KanbanColumn {
  title: string;
  statusColor: string;
  statusTextColor: string;
  tasks: KanbanTask[];
  count: number;
}
