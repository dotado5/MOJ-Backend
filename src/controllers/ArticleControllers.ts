import { Request, Response } from "express";
import { Article } from "../models/articleModel";

const createArticle = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newArticle = await Article.create(body);
    console.log(newArticle);

    const document = await Article.findOne({ name: body.name });

    res.status(200).send({
      message: "Article created successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
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

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).send({
        status: "Error",
        message: "Article not found",
      });
    }

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

export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle };
