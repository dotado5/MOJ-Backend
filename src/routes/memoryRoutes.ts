import express from "express";
import { 
  uploadMemory, 
  uploadMemoryWithImage,
  uploadImageOnly,
  getAllMemories, 
  getMemoriesByActivity,
  getGalleryByEvents,
  getMemoryById, 
  updateMemory,
  updateMemoryWithImage, 
  deleteMemory 
} from "../controllers/MemoryController";
import { uploadSingle } from "../middleware/uploadMiddleware";

const memoryRoutes = express.Router();

/**
 * @swagger
 * /memory/upload-image:
 *   post:
 *     summary: Upload image only to S3
 *     description: Uploads an image file to S3 and returns the URL.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Image file to upload (JPG, PNG, GIF, WebP, SVG)
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *       400:
 *         description: Invalid file type or size.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.post("/upload-image", uploadSingle("image"), uploadImageOnly);

/**
 * @swagger
 * /memory/with-image:
 *   post:
 *     summary: Upload memory with image
 *     description: Creates a new memory with S3 image upload.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Image file to upload
 *       - in: formData
 *         name: activityId
 *         type: string
 *         required: true
 *         description: ID of the associated activity/event
 *     responses:
 *       201:
 *         description: Memory created successfully with image.
 *       400:
 *         description: Invalid file or missing activityId.
 *       404:
 *         description: Activity not found.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.post("/with-image", uploadSingle("image"), uploadMemoryWithImage);

/**
 * @swagger
 * /memory/by-events:
 *   get:
 *     summary: Get gallery organized by events
 *     description: Retrieves all activities with their associated memories for gallery organization.
 *     responses:
 *       200:
 *         description: Gallery organized by events loaded successfully.
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
 *                   example: "Gallery organized by events loaded successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       date:
 *                         type: string
 *                       description:
 *                         type: string
 *                       memoryCount:
 *                         type: number
 *                       previewMemories:
 *                         type: array
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.get("/by-events", getGalleryByEvents);

/**
 * @swagger
 * /memory/activity/{activityId}:
 *   get:
 *     summary: Get memories by activity
 *     description: Retrieves all memories associated with a specific activity/event.
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The activity ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of memories per page
 *     responses:
 *       200:
 *         description: Activity memories loaded successfully.
 *       404:
 *         description: Activity not found.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.get("/activity/:activityId", getMemoriesByActivity);

/**
 * @swagger
 * /memory:
 *   post:
 *     summary: Create a memory (without image upload)
 *     description: Creates a new memory record with provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               height:
 *                 type: number
 *                 example: 600
 *               width:
 *                 type: number
 *                 example: 800
 *               imgType:
 *                 type: string
 *                 example: "jpeg"
 *               activityId:
 *                 type: string
 *                 example: "60d5ecb8b90c1c2b8c8e4e3a"
 *     responses:
 *       200:
 *         description: Memory created successfully.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.post("/", uploadMemory);

/**
 * @swagger
 * /memory:
 *   get:
 *     summary: Get all memories
 *     description: Retrieves memories with optional filtering and pagination.
 *     parameters:
 *       - in: query
 *         name: activityId
 *         schema:
 *           type: string
 *         description: Filter by activity ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of memories per page
 *     responses:
 *       200:
 *         description: Memories loaded successfully with pagination.
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
 *                   example: "Memories loaded successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       height:
 *                         type: number
 *                       width:
 *                         type: number
 *                       imgType:
 *                         type: string
 *                       activityId:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalMemories:
 *                       type: number
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.get("/", getAllMemories);

/**
 * @swagger
 * /memory/{id}:
 *   get:
 *     summary: Get memory by ID
 *     description: Retrieves a specific memory by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The memory ID
 *     responses:
 *       200:
 *         description: Memory loaded successfully.
 *       404:
 *         description: Memory not found.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.get("/:id", getMemoryById);

/**
 * @swagger
 * /memory/{id}:
 *   put:
 *     summary: Update memory (without image)
 *     description: Updates a memory record with provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The memory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               height:
 *                 type: number
 *               width:
 *                 type: number
 *               imgType:
 *                 type: string
 *               activityId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Memory updated successfully.
 *       404:
 *         description: Memory not found.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.put("/:id", updateMemory);
memoryRoutes.patch("/:id", updateMemory);

/**
 * @swagger
 * /memory/{id}/with-image:
 *   put:
 *     summary: Update memory with image
 *     description: Updates a memory and optionally replaces its image.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The memory ID
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: New image file (optional)
 *       - in: formData
 *         name: activityId
 *         type: string
 *         required: false
 *         description: New activity ID (optional)
 *     responses:
 *       200:
 *         description: Memory updated successfully.
 *       400:
 *         description: Invalid file type or size.
 *       404:
 *         description: Memory not found.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.put("/:id/with-image", uploadSingle("image"), updateMemoryWithImage);
memoryRoutes.patch("/:id/with-image", uploadSingle("image"), updateMemoryWithImage);

/**
 * @swagger
 * /memory/{id}:
 *   delete:
 *     summary: Delete memory
 *     description: Deletes a memory and its associated S3 image.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The memory ID
 *     responses:
 *       200:
 *         description: Memory deleted successfully.
 *       404:
 *         description: Memory not found.
 *       500:
 *         description: Internal server error.
 */
memoryRoutes.delete("/:id", deleteMemory);

export default memoryRoutes;
