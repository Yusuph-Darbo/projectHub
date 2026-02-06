import { createUser, getUserByEmail } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { LoginBody, RegisterBody } from "../types/auth.js";

export async function register(
  req: Request<{}, any, RegisterBody>,
  res: Response,
): Promise<void> {
  // Object destructuring
  const { name, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // 10 salt rounds - Adding 10 random strings before hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name,
      email,
      hashedPassword,
      role: "USER",
    });

    res.status(201).json({
      id: newUser.user_id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Register error" });
  }
}

export async function login(
  req: Request<{}, any, LoginBody>,
  res: Response,
): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    /* Create a JWT token containing the user's ID, signed with the server secret
           Will expire in an 1 hour and can be used by the client to authenticate future requests
           Authenticates and authorises users which allows users to create tasks only if they
           are logged in / view projects they are apart of
        */
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ id: user.user_id }, jwtSecret, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.user_id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
}
