import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getUserByIdController } from "../controllers/userController.js";

const router = express.Router();

router.get("/", requireAuth, getUserByIdController);

export default router;
