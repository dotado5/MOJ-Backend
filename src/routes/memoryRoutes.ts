import express from "express";
import { uploadMemory, getAllMemories } from "../controllers/MemoryController";

const memoryRoutes = express.Router();

/**
 * @swagger
 * /memories:
 *   post:
 *     summary: Upload a memory
 *     description: Uploads a new memory to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 example: "John"
 *               height:
 *                 type: number
 *                 example: 0
 *               width:
 *                 type: number
 *                 example: 0
 *               imgType:
 *                 type: string
 *                 example: "jpeg"
 *               activityId:
 *                 type: string
 *                 example: "Christmas"
 *     responses:
 *       201:
 *         description: Memory successfully uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Memory successfully uploaded 66ed615010288100e0979621
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.post("/", uploadMemory);

/**
 * @swagger
 * /memories:
 *   get:
 *     summary: Get all memories
 *     description: Retrieves all memories from the database.
 *     responses:
 *       200:
 *         description: A list of all memories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "All memories loaded successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       profileImage:
 *                         type: string
 *                         example: "profile.jpg"
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.get("/", getAllMemories);

export default memoryRoutes;
