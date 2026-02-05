import type { Response, NextFunction } from "express";

/* Intercepts the request to the controllers and verifies user using jwt,
   if the user is verified will pass the request along 
*/

import jwt from "jsonwebtoken";
import { getUserById } from "../models/user.js";
import type { AuthenticatedRequest } from "../types/models/auth.js";

interface JwtPayload {
  id: number;
  email?: string;
  role?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // Gets the token after the Bearer
    const token = authHeader.split(" ")[1];

    if (!token || !process.env.JWT_SECRET) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await getUserById(decoded.id);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Attaching user to request
    req.user = {
      id: user.user_id,
      email: user.email,
      role: user.role,
    };

    // Go to next middleware / handler
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
}
