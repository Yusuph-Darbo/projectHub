export interface CreateUser {
  name: string;
  email: string;
  hashedPassword: string;
  role: string;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}

export interface PublicUser {
  user_id: number;
  name: string;
  email: string;
  role: string;
}
