import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addUserToProjectController,
  removeUserFromProjectController,
  getAllMembersOfProjectController,
} from "../controllers/projectAssignmentController.js";

const router = express.Router();

router.post("/:id/assign", requireAuth, addUserToProjectController);
router.delete("/:id/unassign", requireAuth, removeUserFromProjectController);
router.get("/:id", requireAuth, getAllMembersOfProjectController);

export default router;
