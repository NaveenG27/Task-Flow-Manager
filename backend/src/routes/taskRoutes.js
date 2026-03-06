import express from "express";
import { 
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  updateTaskPriority,
  deleteTask 
} from "../controllers/taskController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin + Super Admin 
router.post(
  "/create",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  createTask
);

// All roles can view tasks
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "super_admin", "user"),
  getAllTasks
);

// Get task by ID
router.get(
  "/:id",
  authMiddleware,
  allowRoles("admin", "super_admin", "user"),
  getTaskById
);

// Update task status 
router.put(
  "/status/:id",
  authMiddleware,
  allowRoles("admin", "super_admin", "user"),
  updateTaskStatus
);

// Update priority (admin only)
router.put(
  "/priority/:id",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  updateTaskPriority
);

// Delete task (super admin only)
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("super_admin"),
  deleteTask
);

export default router;