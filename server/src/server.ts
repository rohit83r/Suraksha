import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { PrismaClient } from "./generated/prisma/client";
import authRoutes from "./routes/authRoutes"; // you'll create this next
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---------- Prisma Connection ----------
(async () => {
    try {
        await prisma.$connect();
        console.log("✅ Connected to database");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
})();

// ---------- Routes ----------
app.get("/", (req: Request, res: Response) => {
    res.send("🌍 Suraksha Backend API is running...");
});

// Auth routes (Tourist + Admin)
app.use("/api/auth", authRoutes);
app.use(authenticate); // Protect routes below this middleware

// Example protected route
app.get("/api/protected", (req: Request, res: Response) => {
    res.json({ message: "This is a protected route" });
});

// ---------- Error Handling ----------
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ---------- Server ----------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
