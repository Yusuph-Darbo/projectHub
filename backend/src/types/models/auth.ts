import type { Request } from "express";

// Generic Express request with typed params/body and an authenticated `user`
// injected by the requireAuth middleware.
export interface AuthenticatedRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user: {
    id: number;
    email: string;
    role: string;
  };
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
