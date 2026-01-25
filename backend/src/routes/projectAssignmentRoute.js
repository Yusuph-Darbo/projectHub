import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { addUserToProjectController } from "../controllers/projectAssignmentController.js";

const router = express.Router();

router.post("/:id/assign", requireAuth, addUserToProjectController);

export default router;
