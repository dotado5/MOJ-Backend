import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import activityRoutes from "./routes/activityRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Connect to MongoDB
connectDB();
// app.use(cors());
app.use(express.json());

// Routes
app.use("/activity", activityRoutes);

// Home route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
