import { Request, Response } from "express";
import Category, { ICategory } from "../models/categoryModel";
import AudioMessage from "../models/audioMessageModel";
import { validationResult } from "express-validator";

class CategoryController {
  /**
   * Get all categories with pagination and filtering
   */
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      const includeInactive = req.query.includeInactive === "true";
      const search = req.query.search as string;
      
      // Build query
      let query: any = {};
      
      if (!includeInactive) {
        query.isActive = true;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      
      const [categories, total] = await Promise.all([
        Category.find(query)
          .sort({ sortOrder: 1, name: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments(query),
      ]);
      
      const totalPages = Math.ceil(total / limit);
      
      res.status(200).json({
        status: "Success",
        message: "Categories retrieved successfully",
        data: categories,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve categories",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get active categories (for dropdowns and forms)
   */
  async getActiveCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .select("name")
        .lean();
      
      const categoryNames = categories.map(cat => cat.name);
      
      res.status(200).json({
        status: "Success",
        message: "Active categories retrieved successfully",
        data: categoryNames,
      });
    } catch (error) {
      console.error("Error getting active categories:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve active categories",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const category = await Category.findById(id);
      
      if (!category) {
        res.status(404).json({
          status: "Error",
          message: "Category not found",
        });
        return;
      }
      
      res.status(200).json({
        status: "Success",
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error) {
      console.error("Error getting category:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve category",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Create a new category
   */
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: "Error",
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { name, description, sortOrder } = req.body;
      
      // Check if category name already exists
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });
      
      if (existingCategory) {
        res.status(400).json({
          status: "Error",
          message: "Category name already exists",
        });
        return;
      }

      // Get next sort order if not provided
      let finalSortOrder = sortOrder;
      if (!finalSortOrder) {
        const lastCategory = await Category.findOne({}).sort({ sortOrder: -1 });
        finalSortOrder = lastCategory ? lastCategory.sortOrder + 1 : 1;
      }

      const category = new Category({
        name,
        description,
        sortOrder: finalSortOrder,
      });

      await category.save();

      res.status(201).json({
        status: "Success",
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Update a category
   */
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, sortOrder, isActive } = req.body;
      
      const category = await Category.findById(id);
      
      if (!category) {
        res.status(404).json({
          status: "Error",
          message: "Category not found",
        });
        return;
      }

      // Check if new name already exists (excluding current category)
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${name}$`, 'i') },
          _id: { $ne: id }
        });
        
        if (existingCategory) {
          res.status(400).json({
            status: "Error",
            message: "Category name already exists",
          });
          return;
        }
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          name: name || category.name,
          description: description !== undefined ? description : category.description,
          sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
          isActive: isActive !== undefined ? isActive : category.isActive,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "Success",
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to update category",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const category = await Category.findById(id);
      
      if (!category) {
        res.status(404).json({
          status: "Error",
          message: "Category not found",
        });
        return;
      }

      // Check if category is being used by any audio messages
      const audioMessagesCount = await AudioMessage.countDocuments({ 
        category: category.name,
        isActive: true 
      });
      
      if (audioMessagesCount > 0) {
        res.status(400).json({
          status: "Error",
          message: `Cannot delete category. It is currently used by ${audioMessagesCount} audio message(s). Please reassign or delete those messages first.`,
        });
        return;
      }

      await Category.findByIdAndDelete(id);

      res.status(200).json({
        status: "Success",
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to delete category",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Reorder categories
   */
  async reorderCategories(req: Request, res: Response): Promise<void> {
    try {
      const { categoryOrders } = req.body; // Array of { id, sortOrder }
      
      if (!Array.isArray(categoryOrders)) {
        res.status(400).json({
          status: "Error",
          message: "categoryOrders must be an array",
        });
        return;
      }

      // Update sort orders
      const updatePromises = categoryOrders.map(({ id, sortOrder }) =>
        Category.findByIdAndUpdate(id, { sortOrder }, { new: true })
      );

      await Promise.all(updatePromises);

      res.status(200).json({
        status: "Success",
        message: "Categories reordered successfully",
      });
    } catch (error) {
      console.error("Error reordering categories:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to reorder categories",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get category usage statistics
   */
  async getCategoryStats(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
      
      const stats = await Promise.all(
        categories.map(async (category) => {
          const messageCount = await AudioMessage.countDocuments({
            category: category.name,
            isActive: true,
          });
          
          return {
            _id: category._id,
            name: category.name,
            description: category.description,
            messageCount,
            sortOrder: category.sortOrder,
          };
        })
      );

      res.status(200).json({
        status: "Success",
        message: "Category statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error getting category stats:", error);
      res.status(500).json({
        status: "Error",
        message: "Failed to retrieve category statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new CategoryController(); 