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

export { uploadMemory, getAllMemories };
