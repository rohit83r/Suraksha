import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { PrismaClient } from "./generated/prisma/client";
import authRoutes from "./routes/auth.routes"; // you'll create this next
import { authenticate } from "./middleware/authMiddleware";
import touristProfileRoutes from "./routes/touristProfile.routes";
import tripRoutes from "./routes/trip.routes";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import geofenceRouter from "./routes/geofence";
import locationRouterFactory from "./routes/location";


dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;



// ---------- Middleware ----------
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));


// Create server & io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

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

app.use("/api/tourist", touristProfileRoutes);
app.use("/api/trip", tripRoutes);
// ---------- Error Handling ----------
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Mount routes
app.use("/api/geofences", geofenceRouter);
app.use("/api/location", locationRouterFactory(io));

// Socket auth & rooms (simple example)
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // Admin joins a geofence room to receive geofence alerts.
  socket.on("join_geofence_room", (geoId: string) => {
    socket.join(`geo_${geoId}`);
    console.log(`socket ${socket.id} joined geo_${geoId}`);
  });

  socket.on("leave_geofence_room", (geoId: string) => {
    socket.leave(`geo_${geoId}`);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});



// ---------- Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
