import express from "express";
import {
  createArticle,
  createArticleWithImage,
  uploadArticleImage,
  getAllArticles,
  getAllArticlesWithAuthors,
  getArticleById,
  getArticleByIdWithAuthor,
  updateArticle,
  updateArticleWithImage,
  deleteArticle,
} from "../controllers/ArticleControllers";
import { uploadSingle, handleUploadError } from "../middleware/uploadMiddleware";

const articleRoutes = express.Router();

/**
 * @swagger
 * /articles/upload-image:
 *   post:
 *     summary: Upload an article image
 *     description: Upload an image file to S3 for article thumbnail
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
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: https://bucket.s3.amazonaws.com/articles/uuid.jpg
 *       400:
 *         description: Bad request (no file, invalid file type, etc.)
 *       500:
 *         description: Internal server error
 */
articleRoutes.post("/upload-image", uploadSingle("image"), handleUploadError, uploadArticleImage);

/**
 * @swagger
 * /articles/with-image:
 *   post:
 *     summary: Create a new article with image
 *     description: Create a new article and upload thumbnail image in one request
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: Article thumbnail image
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *       - in: formData
 *         name: authorId
 *         type: string
 *         required: true
 *       - in: formData
 *         name: text
 *         type: string
 *         required: true
 *       - in: formData
 *         name: readTime
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Article created successfully with image
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
articleRoutes.post("/with-image", uploadSingle("image"), handleUploadError, createArticleWithImage);

/**
 * @swagger
 * /articles/with-authors:
 *   get:
 *     summary: Get all articles with author information
 *     description: Retrieve all articles with populated author data, pagination, and enhanced metadata for articles page
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         description: Page number (default: 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: Number of articles per page (default: 10)
 *         example: 10
 *     responses:
 *       200:
 *         description: Articles with authors loaded successfully
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
 *                   example: Articles with authors loaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       displayImage:
 *                         type: string
 *                         example: https://bucket.s3.amazonaws.com/articles/uuid.jpg
 *                       title:
 *                         type: string
 *                       authorId:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           profileImage:
 *                             type: string
 *                       text:
 *                         type: string
 *                       excerpt:
 *                         type: string
 *                       date:
 *                         type: string
 *                       formattedDate:
 *                         type: string
 *                       timeAgo:
 *                         type: string
 *                         example: 2 hours ago
 *                       estimatedReadTime:
 *                         type: string
 *                         example: 5 mins read
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalArticles:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 */
articleRoutes.get("/with-authors", getAllArticlesWithAuthors);

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
 *                 example: "https://bucket.s3.amazonaws.com/articles/image.jpg"
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

// Get article by ID (basic)
articleRoutes.get("/:id", getArticleById);

// Get article by ID with author information
articleRoutes.get("/:id/with-author", getArticleByIdWithAuthor);

// Update article by ID (JSON only)
articleRoutes.put("/:id", updateArticle);
articleRoutes.patch("/:id", updateArticle);

// Update article with image upload
articleRoutes.put("/:id/with-image", uploadSingle("image"), handleUploadError, updateArticleWithImage);
articleRoutes.patch("/:id/with-image", uploadSingle("image"), handleUploadError, updateArticleWithImage);

// Delete article by ID
articleRoutes.delete("/:id", deleteArticle);

export default articleRoutes;
