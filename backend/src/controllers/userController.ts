import { getUserById } from "../models/user.js";
import type { Request, Response } from "express";

export async function getUserByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // comes from requireAuth middleware
  const userId = req.user.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Getting user error" });
  }
}
