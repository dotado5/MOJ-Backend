import { Request, Response } from "express";
import { Article } from "../models/articleModel";
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

export { 
  createArticle, 
  createArticleWithImage,
  uploadArticleImage,
  getAllArticles, 
  getArticleById, 
  updateArticle, 
  updateArticleWithImage,
  deleteArticle 
};
