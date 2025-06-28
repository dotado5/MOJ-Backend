import * as functions from "firebase-functions";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import activityRoutes from "./routes/activityRoutes";
import articleRoutes from "./routes/articleRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import authorRoutes from "./routes/authorRoutes";
import coordinatorRoutes from "./routes/coordinatorRoutes";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || functions.config().mongo?.url;
mongoose
  .connect(MONGO_URL!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "https://church-site-seven.vercel.app, https://api-2at6qg5khq-uc.a.run.app",
      "http://localhost:3000",
    ],
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use("/activity", activityRoutes);
app.use("/article", articleRoutes);
app.use("/author", authorRoutes);
app.use("/memory", memoryRoutes);
app.use("/coordinator", coordinatorRoutes);

app.get("/", (req, res) => {
  res.send("Firebase + Express + MongoDB API is working!");
});

export const api = functions.https.onRequest(app);
