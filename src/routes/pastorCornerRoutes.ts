import { Router } from "express";
import {
  createPastorCorner,
  getAllPastorCorners,
  getLatestPastorCorner,
  getPastorCornerById,
  getPastorCornersByPastor,
  updatePastorCorner,
  deletePastorCorner,
} from "../controllers/PastorCornerController";

const pastorCornerRoutes = Router();

// Special routes (must come before parameterized routes)
pastorCornerRoutes.get("/latest", getLatestPastorCorner);
pastorCornerRoutes.get("/pastor/:pastorId", getPastorCornersByPastor);

// Standard CRUD operations
pastorCornerRoutes.post("/", createPastorCorner);
pastorCornerRoutes.get("/", getAllPastorCorners);
pastorCornerRoutes.get("/:id", getPastorCornerById);
pastorCornerRoutes.put("/:id", updatePastorCorner);
pastorCornerRoutes.patch("/:id", updatePastorCorner);
pastorCornerRoutes.delete("/:id", deletePastorCorner);

export default pastorCornerRoutes; 