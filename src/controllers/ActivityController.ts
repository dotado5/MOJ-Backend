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

const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).send({
        status: "Error",
        message: "Activity not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Activity loaded successfully",
      data: activity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedActivity = await Activity.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedActivity) {
      return res.status(404).send({
        status: "Error",
        message: "Activity not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).send({
        status: "Error",
        message: "Activity not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Activity deleted successfully",
      data: deletedActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

export { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity };
