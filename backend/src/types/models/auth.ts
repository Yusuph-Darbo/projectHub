import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  // Adding a optional property to req
  user: {
    id: number;
    email: string;
    role: string;
  };
}
