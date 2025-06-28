import { Router } from "express";
import {
  createActivity,
  getAllActivities,
} from "../controllers/ActivityController";

const activityRoutes = Router();

activityRoutes.post("/", createActivity);

activityRoutes.get("/", getAllActivities);

export default activityRoutes;
