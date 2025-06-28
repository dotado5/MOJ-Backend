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

export { createArticle, getAllArticles };
