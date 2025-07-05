import express from "express";
import {
  createMessage,
  getAllMessages,
  getLatestMessage,
  getMessageById,
  getMessagesByCoordinator,
  updateMessage,
  deleteMessage,
} from "../controllers/MessageController";

const messageRoutes = express.Router();

// Create a new message
messageRoutes.post("/", createMessage);

// Get all messages
messageRoutes.get("/", getAllMessages);

// Get the latest published message
messageRoutes.get("/latest", getLatestMessage);

// Get messages by coordinator
messageRoutes.get("/coordinator/:coordinatorId", getMessagesByCoordinator);

// Get a specific message by ID
messageRoutes.get("/:id", getMessageById);

// Update a message
messageRoutes.put("/:id", updateMessage);

// Delete a message
messageRoutes.delete("/:id", deleteMessage);

export default messageRoutes; 