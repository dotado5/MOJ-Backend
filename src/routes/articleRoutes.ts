import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/ArticleControllers";

const articleRoutes = express.Router();

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     description: Adds a new article to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayImage:
 *                 type: string
 *                 example: "Saint"
 *               title:
 *                 type: string
 *                 example: "The Title of the Article"
 *               authorId:
 *                 type: string
 *                 example: "author123"
 *               text:
 *                 type: string
 *                 example: "This is the text content of the article."
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-11T00:00:00Z"
 *               readTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-11T00:00:00Z"
 *     responses:
 *       201:
 *         description: Document successfully uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Document successfully uploaded 66ed615010288100e0979621
 *       500:
 *         description: Internal server error.
 */
articleRoutes.post("/", createArticle);

/*
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     description: Retrieve all articles stored in the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved all articles.
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
 *                   example: All articles loaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 123abc
 *                       title:
 *                         type: string
 *                         example: "Article Title"
 *                       content:
 *                         type: string
 *                         example: "Article content..."
 *                       authorId:
 *                         type: string
 *                         example: "author123"
 *       500:
 *         description: Internal server error.
 */
articleRoutes.get("/", getAllArticles);

// Get article by ID
articleRoutes.get("/:id", getArticleById);

// Update article by ID
articleRoutes.put("/:id", updateArticle);
articleRoutes.patch("/:id", updateArticle);

// Delete article by ID
articleRoutes.delete("/:id", deleteArticle);

export default articleRoutes;
