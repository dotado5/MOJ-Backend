import { Request, Response } from "express";
import { Message } from "../models/messageModel";

const createMessage = async (req: Request, res: Response) => {
  try {
    const { title, content, coordinatorId, datePublished, isPublished, excerpt } = req.body;

    const newMessage = await Message.create({
      title,
      content,
      coordinatorId,
      datePublished: datePublished || new Date(),
      isPublished: isPublished !== undefined ? isPublished : true,
      excerpt,
    });

    // Populate coordinator information
    await newMessage.populate('coordinatorId', 'name occupation image_url');

    res.status(201).send({
      status: "Success",
      message: "Message created successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while creating the message" 
    });
  }
};

const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, isPublished } = req.query;
    
    const filter: any = {};
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const messages = await Message.find(filter)
      .populate('coordinatorId', 'name occupation image_url')
      .sort({ datePublished: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Message.countDocuments(filter);

    res.status(200).send({
      status: "Success",
      message: "All messages loaded successfully",
      data: messages,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalMessages: total,
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while fetching messages" 
    });
  }
};

const getLatestMessage = async (req: Request, res: Response) => {
  try {
    const latestMessage = await Message.findOne({ isPublished: true })
      .populate('coordinatorId', 'name occupation image_url')
      .sort({ datePublished: -1 });

    if (!latestMessage) {
      return res.status(404).send({
        status: "Error",
        message: "No published messages found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Latest message loaded successfully",
      data: latestMessage,
    });
  } catch (err) {
    console.error("Error fetching latest message:", err);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while fetching the latest message" 
    });
  }
};

const getMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id)
      .populate('coordinatorId', 'name occupation image_url');

    if (!message) {
      return res.status(404).send({
        status: "Error",
        message: "Message not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Message loaded successfully",
      data: message,
    });
  } catch (err) {
    console.error("Error fetching message by ID:", err);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while fetching the message" 
    });
  }
};

const getMessagesByCoordinator = async (req: Request, res: Response) => {
  try {
    const { coordinatorId } = req.params;
    const { page = 1, limit = 10, isPublished } = req.query;

    const filter: any = { coordinatorId };
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const messages = await Message.find(filter)
      .populate('coordinatorId', 'name occupation image_url')
      .sort({ datePublished: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Message.countDocuments(filter);

    res.status(200).send({
      status: "Success",
      message: "Messages by coordinator loaded successfully",
      data: messages,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalMessages: total,
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching messages by coordinator:", err);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while fetching messages by coordinator" 
    });
  }
};

const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, coordinatorId, datePublished, isPublished, excerpt } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      {
        title,
        content,
        coordinatorId,
        datePublished,
        isPublished,
        excerpt,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('coordinatorId', 'name occupation image_url');

    if (!updatedMessage) {
      return res.status(404).send({
        status: "Error",
        message: "Message not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while updating the message" 
    });
  }
};

const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).send({
        status: "Error",
        message: "Message not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Message deleted successfully",
      data: deletedMessage,
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).send({ 
      status: "Error",
      message: "Something went wrong while deleting the message" 
    });
  }
};

export { 
  createMessage, 
  getAllMessages, 
  getLatestMessage, 
  getMessageById, 
  getMessagesByCoordinator, 
  updateMessage, 
  deleteMessage 
}; 