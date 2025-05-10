import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import activityRoutes from "./routes/activityRoutes";
import articleRoutes from "./routes/articleRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import authorRoutes from "./routes/authorRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());

app.use("/activity", activityRoutes);
app.use("/article", articleRoutes);
app.use("/author", authorRoutes);
app.use("/memory", memoryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
