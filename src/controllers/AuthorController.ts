import { Request, Response } from "express";
import { Author } from "../models/authorModel";

const createAuthor = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newAuthor = await Author.create(body);
    console.log(newAuthor);

    const document = await Author.findOne({ name: body.name });

    res.status(200).send({
      message: "Author created successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find({});

    res.status(200).send({
      status: "Success",
      message: "All authors loaded successfully",
      data: authors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { createAuthor, getAllAuthors };
