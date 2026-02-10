export interface ProjectAssignment {
  joined_at: Date;
  project_id: number;
  user_id: number;
}

export interface Member {
  user_id: number;
  name: string;
  email?: string;
}
