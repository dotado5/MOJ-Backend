import express from "express";
import {
  createCoordinator,
  createCoordinatorWithImage,
  uploadCoordinatorImage,
  getAllCoordinators,
  getFeaturedCoordinator,
  getCoordinatorById,
  updateCoordinator,
  updateCoordinatorWithImage,
  setFeaturedCoordinator,
  deleteCoordinator,
} from "../controllers/CoordinatorController";
import { uploadSingle, handleUploadError } from "../middleware/uploadMiddleware";

const coordinatorRoutes = express.Router();

/**
 * @swagger
 * /coordinators/upload-image:
 *   post:
 *     summary: Upload a coordinator image
 *     description: Upload an image file to S3 for coordinator profile
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Image file to upload (max 5MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request (no file, invalid file type, etc.)
 *       500:
 *         description: Internal server error
 */
coordinatorRoutes.post("/upload-image", uploadSingle("image"), handleUploadError, uploadCoordinatorImage);

/**
 * @swagger
 * /coordinators/with-image:
 *   post:
 *     summary: Create a new coordinator with image
 *     description: Create a new coordinator and upload profile image in one request
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: Coordinator profile image
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: occupation
 *         type: string
 *         required: true
 *       - in: formData
 *         name: phone_number
 *         type: string
 *         required: true
 *       - in: formData
 *         name: about
 *         type: string
 *         required: true
 *       - in: formData
 *         name: isFeatured
 *         type: boolean
 *         required: false
 *     responses:
 *       201:
 *         description: Coordinator created successfully with image
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
coordinatorRoutes.post("/with-image", uploadSingle("image"), handleUploadError, createCoordinatorWithImage);

/**
 * @swagger
 * /coordinators/featured:
 *   get:
 *     summary: Get the featured coordinator
 *     description: Retrieve the coordinator marked as featured (Coordinator of the Month)
 *     responses:
 *       200:
 *         description: Featured coordinator loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Featured coordinator loaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     about:
 *                       type: string
 *                     isFeatured:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: No featured coordinator found
 *       500:
 *         description: Internal server error
 */
coordinatorRoutes.get("/featured", getFeaturedCoordinator);

/**
 * @swagger
 * /coordinators:
 *   post:
 *     summary: Create a new coordinator
 *     description: Adds a new coordinator to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               occupation:
 *                 type: string
 *                 example: "Senior Coordinator"
 *               phone_number:
 *                 type: string
 *                 example: "+234123456789"
 *               image_url:
 *                 type: string
 *                 example: "https://bucket.s3.amazonaws.com/coordinators/image.jpg"
 *               about:
 *                 type: string
 *                 example: "Biography and background information"
 *               isFeatured:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Coordinator created successfully
 *       500:
 *         description: Internal server error
 */
coordinatorRoutes.post("/", createCoordinator);

/**
 * @swagger
 * /coordinators:
 *   get:
 *     summary: Get all coordinators
 *     description: Retrieve all coordinators stored in the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved all coordinators
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: All coordinators loaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       occupation:
 *                         type: string
 *                       phone_number:
 *                         type: string
 *                       image_url:
 *                         type: string
 *                       about:
 *                         type: string
 *                       isFeatured:
 *                         type: boolean
 *       500:
 *         description: Internal server error
 */
coordinatorRoutes.get("/", getAllCoordinators);

// Get coordinator by ID
coordinatorRoutes.get("/:id", getCoordinatorById);

// Update coordinator by ID (JSON only)
coordinatorRoutes.put("/:id", updateCoordinator);
coordinatorRoutes.patch("/:id", updateCoordinator);

// Update coordinator with image upload
coordinatorRoutes.put("/:id/with-image", uploadSingle("image"), handleUploadError, updateCoordinatorWithImage);
coordinatorRoutes.patch("/:id/with-image", uploadSingle("image"), handleUploadError, updateCoordinatorWithImage);

// Set coordinator as featured
coordinatorRoutes.patch("/:id/featured", setFeaturedCoordinator);

// Delete coordinator by ID
coordinatorRoutes.delete("/:id", deleteCoordinator);

export default coordinatorRoutes;
