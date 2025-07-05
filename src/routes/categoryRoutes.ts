import { Router } from "express";
import { body } from "express-validator";
import CategoryController from "../controllers/CategoryController";

const router = Router();

// Validation middleware for category creation/update
const validateCategory = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage("Category name can only contain letters, spaces, and hyphens"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a non-negative integer"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// Routes

/**
 * GET /categories
 * Get all categories with pagination and filtering
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - includeInactive: boolean (default: false)
 * - search: string (search in name and description)
 */
router.get("/", CategoryController.getAllCategories);

/**
 * GET /categories/active
 * Get active categories for dropdowns (returns just names)
 */
router.get("/active", CategoryController.getActiveCategories);

/**
 * GET /categories/stats
 * Get category usage statistics
 */
router.get("/stats", CategoryController.getCategoryStats);

/**
 * GET /categories/:id
 * Get a single category by ID
 * Params:
 * - id: string (category ID)
 */
router.get("/:id", CategoryController.getCategoryById);

/**
 * POST /categories
 * Create a new category
 * Body:
 * - name: string (required, 1-50 chars, letters/spaces/hyphens only)
 * - description: string (optional, max 200 chars)
 * - sortOrder: number (optional, defaults to next available)
 */
router.post("/", validateCategory, CategoryController.createCategory);

/**
 * PUT /categories/:id
 * Update a category
 * Params:
 * - id: string (category ID)
 * Body:
 * - name: string (optional, 1-50 chars, letters/spaces/hyphens only)
 * - description: string (optional, max 200 chars)
 * - sortOrder: number (optional)
 * - isActive: boolean (optional)
 */
router.put("/:id", validateCategory, CategoryController.updateCategory);

/**
 * DELETE /categories/:id
 * Delete a category (only if not used by any audio messages)
 * Params:
 * - id: string (category ID)
 */
router.delete("/:id", CategoryController.deleteCategory);

/**
 * PUT /categories/reorder
 * Reorder categories
 * Body:
 * - categoryOrders: Array<{id: string, sortOrder: number}>
 */
router.put("/reorder", CategoryController.reorderCategories);

export default router; 