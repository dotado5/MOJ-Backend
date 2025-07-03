import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import activityRoutes from "./routes/activityRoutes";
import articleRoutes from "./routes/articleRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import authorRoutes from "./routes/authorRoutes";
import cors from "cors";
import coordinatorRoutes from "./routes/coordinatorRoutes";
import pastorRoutes from "./routes/pastorRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5000", "https://church-site-seven.vercel.app"],
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
app.use("/pastor", pastorRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
