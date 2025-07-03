import { Request, Response } from "express";
import { Article } from "../models/articleModel";
import { Author } from "../models/authorModel";
import s3Service from "../services/s3Service";

const createArticle = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newArticle = await Article.create(body);
    console.log(newArticle);

    res.status(201).send({
      status: "Success",
      message: "Article created successfully",
      data: newArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const createArticleWithImage = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const file = req.file;

    let displayImageUrl = "";

    // Upload image to S3 if file is provided
    if (file) {
      try {
        displayImageUrl = await s3Service.uploadImage(
          file.buffer,
          file.originalname,
          "articles"
        );
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        return res.status(500).send({
          status: "Error",
          message: "Failed to upload image to S3",
        });
      }
    }

    // Create article with image URL
    const articleData = {
      ...body,
      displayImage: displayImageUrl,
    };

    const newArticle = await Article.create(articleData);

    res.status(201).send({
      status: "Success",
      message: "Article created successfully with image",
      data: newArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const uploadArticleImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send({
        status: "Error",
        message: "No image file provided",
      });
    }

    // Upload image to S3
    const imageUrl = await s3Service.uploadImage(
      file.buffer,
      file.originalname,
      "articles"
    );

    res.status(200).send({
      status: "Success",
      message: "Image uploaded successfully",
      data: {
        imageUrl: imageUrl,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Error",
      message: "Failed to upload image",
    });
  }
};

const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find({});

    res.status(200).send({
      status: "Success",
      message: "All articles loaded successfully",
      data: articles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getAllArticlesWithAuthors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get articles with pagination
    const articles = await Article.find({})
      .sort({ date: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalArticles = await Article.countDocuments({});
    const totalPages = Math.ceil(totalArticles / limit);

    // Populate author information for each article
    const articlesWithAuthors = await Promise.all(
      articles.map(async (article) => {
        try {
          const author = await Author.findById(article.authorId);
          
          // Calculate read time (approximate: 200 words per minute)
          const wordCount = article.text.split(' ').length;
          const readTimeMinutes = Math.ceil(wordCount / 200);
          
          // Format date as "X hours/days ago"
          const timeAgo = getTimeAgo(article.date);
          
          return {
            _id: article._id,
            displayImage: article.displayImage,
            title: article.title,
            authorId: article.authorId,
            author: author ? {
              _id: author._id,
              firstName: author.firstName,
              lastName: author.lastName,
              fullName: `${author.firstName} ${author.lastName}`,
              profileImage: author.profileImage,
            } : null,
            text: article.text,
            excerpt: article.text.substring(0, 150) + (article.text.length > 150 ? '...' : ''),
            date: article.date,
            formattedDate: new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            timeAgo: timeAgo,
            readTime: article.readTime,
            estimatedReadTime: `${readTimeMinutes} min${readTimeMinutes > 1 ? 's' : ''} read`,
          };
        } catch (error) {
          console.error(`Error processing article ${article._id}:`, error);
          return {
            _id: article._id,
            displayImage: article.displayImage,
            title: article.title,
            authorId: article.authorId,
            author: null,
            text: article.text,
            excerpt: article.text.substring(0, 150) + (article.text.length > 150 ? '...' : ''),
            date: article.date,
            formattedDate: new Date(article.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            timeAgo: getTimeAgo(article.date),
            readTime: article.readTime,
            estimatedReadTime: "5 mins read", // fallback
          };
        }
      })
    );

    res.status(200).send({
      status: "Success",
      message: "Articles with authors loaded successfully",
      data: articlesWithAuthors,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalArticles: totalArticles,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).send({
        status: "Error",
        message: "Article not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Article loaded successfully",
      data: article,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getArticleByIdWithAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).send({
        status: "Error",
        message: "Article not found",
      });
    }

    // Populate author information
    const author = await Author.findById(article.authorId);
    
    // Calculate read time
    const wordCount = article.text.split(' ').length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    
    const articleWithAuthor = {
      _id: article._id,
      displayImage: article.displayImage,
      title: article.title,
      authorId: article.authorId,
      author: author ? {
        _id: author._id,
        firstName: author.firstName,
        lastName: author.lastName,
        fullName: `${author.firstName} ${author.lastName}`,
        profileImage: author.profileImage,
      } : null,
      text: article.text,
      excerpt: article.text.substring(0, 150) + (article.text.length > 150 ? '...' : ''),
      date: article.date,
      formattedDate: new Date(article.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timeAgo: getTimeAgo(article.date),
      readTime: article.readTime,
      estimatedReadTime: `${readTimeMinutes} min${readTimeMinutes > 1 ? 's' : ''} read`,
    };

    res.status(200).send({
      status: "Success",
      message: "Article with author loaded successfully",
      data: articleWithAuthor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedArticle = await Article.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedArticle) {
      return res.status(404).send({
        status: "Error",
        message: "Article not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateArticleWithImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const file = req.file;

    // Find existing article
    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return res.status(404).send({
        status: "Error",
        message: "Article not found",
      });
    }

    let updateData = { ...body };

    // Handle image upload if new file is provided
    if (file) {
      try {
        // Delete old image if it exists
        if (existingArticle.displayImage) {
          try {
            await s3Service.deleteImage(existingArticle.displayImage);
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError);
            // Continue with update even if delete fails
          }
        }

        // Upload new image
        const newImageUrl = await s3Service.uploadImage(
          file.buffer,
          file.originalname,
          "articles"
        );

        updateData.displayImage = newImageUrl;
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        return res.status(500).send({
          status: "Error",
          message: "Failed to upload new image to S3",
        });
      }
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      status: "Success",
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).send({
        status: "Error",
        message: "Article not found",
      });
    }

    // Delete image from S3 if it exists
    if (article.displayImage) {
      try {
        await s3Service.deleteImage(article.displayImage);
      } catch (deleteError) {
        console.warn("Failed to delete image from S3:", deleteError);
        // Continue with article deletion even if image delete fails
      }
    }

    const deletedArticle = await Article.findByIdAndDelete(id);

    res.status(200).send({
      status: "Success",
      message: "Article deleted successfully",
      data: deletedArticle,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

// Utility function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const articleDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - articleDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

export { 
  createArticle, 
  createArticleWithImage,
  uploadArticleImage,
  getAllArticles, 
  getAllArticlesWithAuthors,
  getArticleById, 
  getArticleByIdWithAuthor,
  updateArticle, 
  updateArticleWithImage,
  deleteArticle 
};
