import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { getLogs } from "../controllers/logController.js";

const router = express.Router();

// Admin + Super Admin can view logs
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  getLogs
);

export default router;