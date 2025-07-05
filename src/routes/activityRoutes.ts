import { Router } from "express";
import {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/ActivityController";

const activityRoutes = Router();

activityRoutes.post("/", createActivity);
activityRoutes.get("/", getAllActivities);
activityRoutes.get("/:id", getActivityById);
activityRoutes.put("/:id", updateActivity);
activityRoutes.patch("/:id", updateActivity);
activityRoutes.delete("/:id", deleteActivity);

export default activityRoutes;
