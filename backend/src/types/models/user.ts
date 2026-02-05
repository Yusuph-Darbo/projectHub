export interface CreateUser {
  name: string;
  email: string;
  hashedPassword: string;
  role: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}
