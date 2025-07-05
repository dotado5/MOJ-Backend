import { Request, Response } from "express";
import { PastorCorner } from "../models/pastorCornerModel";

const createPastorCorner = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newPastorCorner = await PastorCorner.create(body);
    await newPastorCorner.populate("pastorId", "name title");

    res.status(201).send({
      status: "Success",
      message: "Pastor corner post created successfully",
      data: newPastorCorner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllPastorCorners = async (req: Request, res: Response) => {
  try {
    const pastorCorners = await PastorCorner.find({})
      .populate("pastorId", "name title image")
      .sort({ datePublished: -1 });

    res.status(200).send({
      status: "Success",
      message: "All pastor corner posts loaded successfully",
      data: pastorCorners,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getLatestPastorCorner = async (req: Request, res: Response) => {
  try {
    const latestPost = await PastorCorner.findOne({ isPublished: true })
      .populate("pastorId", "name title image")
      .sort({ datePublished: -1 });

    if (!latestPost) {
      return res.status(404).send({
        status: "Error",
        message: "No published pastor corner posts found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Latest pastor corner post loaded successfully",
      data: latestPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getPastorCornerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pastorCorner = await PastorCorner.findById(id)
      .populate("pastorId", "name title image");

    if (!pastorCorner) {
      return res.status(404).send({
        status: "Error",
        message: "Pastor corner post not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Pastor corner post loaded successfully",
      data: pastorCorner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getPastorCornersByPastor = async (req: Request, res: Response) => {
  try {
    const { pastorId } = req.params;
    const pastorCorners = await PastorCorner.find({ pastorId })
      .populate("pastorId", "name title image")
      .sort({ datePublished: -1 });

    res.status(200).send({
      status: "Success",
      message: "Pastor corner posts by pastor loaded successfully",
      data: pastorCorners,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updatePastorCorner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedPastorCorner = await PastorCorner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("pastorId", "name title image");

    if (!updatedPastorCorner) {
      return res.status(404).send({
        status: "Error",
        message: "Pastor corner post not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Pastor corner post updated successfully",
      data: updatedPastorCorner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deletePastorCorner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPastorCorner = await PastorCorner.findByIdAndDelete(id);

    if (!deletedPastorCorner) {
      return res.status(404).send({
        status: "Error",
        message: "Pastor corner post not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Pastor corner post deleted successfully",
      data: deletedPastorCorner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { 
  createPastorCorner, 
  getAllPastorCorners, 
  getLatestPastorCorner,
  getPastorCornerById, 
  getPastorCornersByPastor,
  updatePastorCorner, 
  deletePastorCorner 
}; 