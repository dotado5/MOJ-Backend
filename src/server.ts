import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import activityRoutes from "./routes/activityRoutes";
import articleRoutes from "./routes/articleRoutes";
import memoryRoutes from "./routes/memoryRoutes";
import authorRoutes from "./routes/authorRoutes";
import cors from "cors";
import coordinatorRoutes from "./routes/coordinatorRoutes";
import messageRoutes from "./routes/messageRoutes";
import audioMessageRoutes from "./routes/audioMessageRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import Category from "./models/categoryModel";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to database and initialize defaults
const initializeApp = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");
    
    // Initialize default categories after DB connection
    const count = await Category.countDocuments({});
    
    if (count === 0) {
      const defaultCategories = [
        { name: "Sermons", description: "Sunday sermons and teachings", sortOrder: 1 },
        { name: "Youth", description: "Youth ministry messages", sortOrder: 2 },
        { name: "Worship", description: "Worship and praise messages", sortOrder: 3 },
        { name: "Teaching", description: "Bible study and teaching series", sortOrder: 4 },
        { name: "Prayer", description: "Prayer meetings and devotionals", sortOrder: 5 },
      ];
      
      await Category.insertMany(defaultCategories);
      console.log("✅ Default audio message categories initialized");
    } else {
      console.log("📂 Categories already exist, skipping initialization");
    }
  } catch (error) {
    console.error("❌ Error during app initialization:", error);
  }
};

initializeApp();

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:8000", "https://church-site-seven.vercel.app"],
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
app.use("/message", messageRoutes);
app.use("/audio-messages", audioMessageRoutes);
app.use("/categories", categoryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
