import { Router } from "express";
import {
  createCoordinator,
  getAllCoordinators,
  getCoordinatorById,
  updateCoordinator,
  deleteCoordinator,
} from "../controllers/CoordinatorController";

const coordinatorRoutes = Router();

coordinatorRoutes.post("/", createCoordinator);
coordinatorRoutes.get("/", getAllCoordinators);
coordinatorRoutes.get("/:id", getCoordinatorById);
coordinatorRoutes.put("/:id", updateCoordinator);
coordinatorRoutes.patch("/:id", updateCoordinator);
coordinatorRoutes.delete("/:id", deleteCoordinator);

export default coordinatorRoutes;
