import { Router } from "express";
import { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } from "../controllers/AuthorController";

const authorRoutes = Router();

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     description: Adds a new author to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               profileImage:
 *                 type: string
 *                 example: "profileImage.jpg"
 *     responses:
 *       201:
 *         description: Author successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Document successfully uploaded 66ed615010288100e0979621
 *       500:
 *         description: Internal server error.
 */
authorRoutes.post("/", createAuthor);

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Retrieves all authors from the database.
 *     responses:
 *       200:
 *         description: A list of all authors.
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
 *                   example: "All authors loaded successfully"
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
 *                         example: "profileImage.jpg"
 *       500:
 *         description: Internal server error.
 */
authorRoutes.get("/", getAllAuthors);

// Get author by ID
authorRoutes.get("/:id", getAuthorById);

// Update author by ID
authorRoutes.put("/:id", updateAuthor);
authorRoutes.patch("/:id", updateAuthor);

// Delete author by ID
authorRoutes.delete("/:id", deleteAuthor);

export default authorRoutes;
