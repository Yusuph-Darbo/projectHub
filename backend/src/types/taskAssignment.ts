export interface TaskAssignment {
  user_id: number;
  task_id: number;
  assigned_at: Date;
}

export interface TaskSummary {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: Date;
}
