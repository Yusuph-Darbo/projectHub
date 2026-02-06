import type { Request } from "express";

// Use Omit to remove the optional user, then add it back as required
export type AuthenticatedRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> = Omit<Request<Params, ResBody, ReqBody, ReqQuery>, "user"> & {
  user: {
    id: number;
    email: string;
    role: string;
  };
};

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
