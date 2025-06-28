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

export { createCoordinator, getAllCoordinators };
