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

const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).send({
        status: "Error",
        message: "Author not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Author loaded successfully",
      data: author,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedAuthor = await Author.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      return res.status(404).send({
        status: "Error",
        message: "Author not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Author updated successfully",
      data: updatedAuthor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).send({
        status: "Error",
        message: "Author not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Author deleted successfully",
      data: deletedAuthor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor };
