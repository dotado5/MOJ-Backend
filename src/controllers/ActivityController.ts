import { Request, Response } from "express";
import { Activity } from "../models/activityModel";

const createActivity = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const newActivity = await Activity.create(body);
    console.log(newActivity);

    const document = await Activity.findOne({ name: body.name });

    res.status(200).send({
      message: "Activity created successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({});

    res.status(200).send({
      status: "Success",
      message: "All activities loaded successfully",
      data: activities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { createActivity, getAllActivities };
