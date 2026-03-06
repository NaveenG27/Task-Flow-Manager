import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { getDashboardSummary } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  allowRoles("admin", "super_admin"),
  getDashboardSummary
);

export default router;