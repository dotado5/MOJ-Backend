import { Request, Response } from "express";
import { Pastor } from "../models/pastorModel";

const createPastor = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newPastor = await Pastor.create(body);
    console.log(newPastor);

    res.status(201).send({
      status: "Success",
      message: "Pastor created successfully",
      data: newPastor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllPastors = async (req: Request, res: Response) => {
  try {
    const pastors = await Pastor.find({});

    res.status(200).send({
      status: "Success",
      message: "All pastors loaded successfully",
      data: pastors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getActivePastor = async (req: Request, res: Response) => {
  try {
    const activePastor = await Pastor.findOne({ isActive: true });

    if (!activePastor) {
      return res.status(404).send({
        status: "Error",
        message: "No active pastor found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Active pastor loaded successfully",
      data: activePastor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getPastorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pastor = await Pastor.findById(id);

    if (!pastor) {
      return res.status(404).send({
        status: "Error",
        message: "Pastor not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Pastor loaded successfully",
      data: pastor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updatePastor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedPastor = await Pastor.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPastor) {
      return res.status(404).send({
        status: "Error",
        message: "Pastor not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Pastor updated successfully",
      data: updatedPastor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deletePastor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPastor = await Pastor.findByIdAndDelete(id);

    if (!deletedPastor) {
      return res.status(404).send({
        status: "Error",
        message: "Pastor not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Pastor deleted successfully",
      data: deletedPastor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { createPastor, getAllPastors, getActivePastor, getPastorById, updatePastor, deletePastor }; 