import { Request, Response } from "express";
import { Memory } from "../models/memoryModel";

const uploadMemory = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newMemory = await Memory.create(body);
    console.log(newMemory);

    const document = await Memory.findOne({ name: body.name });

    res.status(200).send({
      message: "Memory created successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllMemories = async (req: Request, res: Response) => {
  try {
    const memories = await Memory.find({});

    res.status(200).send({
      status: "Success",
      message: "All Memories loaded successfully",
      data: memories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getMemoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const memory = await Memory.findById(id);

    if (!memory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Memory loaded successfully",
      data: memory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateMemory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedMemory = await Memory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMemory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Memory updated successfully",
      data: updatedMemory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deleteMemory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedMemory = await Memory.findByIdAndDelete(id);

    if (!deletedMemory) {
      return res.status(404).send({
        status: "Error",
        message: "Memory not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Memory deleted successfully",
      data: deletedMemory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { uploadMemory, getAllMemories, getMemoryById, updateMemory, deleteMemory };
