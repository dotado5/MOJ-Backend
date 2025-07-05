import { Router } from "express";
import {
  createPastor,
  getAllPastors,
  getActivePastor,
  getPastorById,
  updatePastor,
  deletePastor,
} from "../controllers/PastorController";

const pastorRoutes = Router();

// Get active pastor (for homepage)
pastorRoutes.get("/active", getActivePastor);

// Standard CRUD operations
pastorRoutes.post("/", createPastor);
pastorRoutes.get("/", getAllPastors);
pastorRoutes.get("/:id", getPastorById);
pastorRoutes.put("/:id", updatePastor);
pastorRoutes.patch("/:id", updatePastor);
pastorRoutes.delete("/:id", deletePastor);

export default pastorRoutes; 