import { Router } from "express";
import {
  createCoordinator,
  getAllCoordinators,
} from "../controllers/CoordinatorController";

const coordinatorRoutes = Router();

coordinatorRoutes.post("/", createCoordinator);

coordinatorRoutes.get("/", getAllCoordinators);

export default coordinatorRoutes;
