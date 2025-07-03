import { Request, Response } from "express";
import { Coordinator } from "../models/coordinatorModel";

const createCoordinator = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newCoordinator = await Coordinator.create(body);
    console.log(newCoordinator);

    const document = await Coordinator.findOne({ name: body.name });

    res.status(200).send({
      message: "Coordinator uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllCoordinators = async (req: Request, res: Response) => {
  try {
    const coordinators = await Coordinator.find({});

    res.status(200).send({
      status: "Success",
      message: "All coordinators loaded successfully",
      data: coordinators,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const getCoordinatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coordinator = await Coordinator.findById(id);

    if (!coordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Coordinator loaded successfully",
      data: coordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateCoordinator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedCoordinator = await Coordinator.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Coordinator updated successfully",
      data: updatedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deleteCoordinator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCoordinator = await Coordinator.findByIdAndDelete(id);

    if (!deletedCoordinator) {
      return res.status(404).send({
        status: "Error",
        message: "Coordinator not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Coordinator deleted successfully",
      data: deletedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { createCoordinator, getAllCoordinators, getCoordinatorById, updateCoordinator, deleteCoordinator };
