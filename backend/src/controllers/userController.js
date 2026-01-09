import { getUserById } from "../models/user.js";

export async function getUserByIdController(req, res) {
  // comes from requireAuth middleware
  const userId = req.user.id;

  try {
    const user = await getUserById(userId);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Getting user error" });
  }
}
