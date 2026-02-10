export interface CreateUser {
  name: string;
  email: string;
  hashedPassword: string;
  role: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  token: string;
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface PublicUser {
  user_id: number;
  name: string;
  email: string;
}
