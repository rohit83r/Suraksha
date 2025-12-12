// server/src/server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { PrismaClient } from "./generated/prisma/client";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/authMiddleware";
import touristProfileRoutes from "./routes/touristProfile.routes";
import tripRoutes from "./routes/trip.routes";
import bodyParser from "body-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import geofenceRouter from "./routes/geofence";
import locationRouterFactory from "./routes/location";
import locationAiRouter from "./routes/locationAiDetection";
import { startAlertsSubscriber } from "./alerts/alertsSubscriber";

dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Create HTTP server + Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" } // tighten in production
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

// Public/auth routes
app.use("/api/auth", authRoutes);

// Protect routes below with authentication middleware
app.use(authenticate);

// Example protected route
app.get("/api/protected", (req: Request, res: Response) => {
  res.json({ message: "This is a protected route" });
});

app.use("/api/tourist", touristProfileRoutes);
app.use("/api/trip", tripRoutes);

// Geofence routes
app.use("/api/geofences", geofenceRouter);

// Location ingestion route factory - pass `io` so route can emit realtime events if needed
app.use("/api/location", locationRouterFactory(io));

// Location AI detection routes (you mentioned path changed)
app.use("/api/location-ai", locationAiRouter);

// ---------- Error Handling ----------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ---------- Socket.IO: connections & rooms ----------
io.on("connection", (socket) => {
  console.log("[io] socket connected", socket.id);

  // Example: tourist client can provide touristId query param to join their room
  // In production: verify JWT, extract userId and roles, and join rooms server-side.
  const touristId = (socket.handshake.query?.touristId as string) || null;
  const role = (socket.handshake.query?.role as string) || null;

  if (touristId) {
    socket.join(`tourist:${touristId}`);
    console.log(`[io] socket ${socket.id} joined tourist:${touristId}`);
  }

  // Admin joins geo-fence room (front-end can emit join_geofence_room too)
  socket.on("join_geofence_room", (geoId: string) => {
    socket.join(`geo_${geoId}`);
    console.log(`[io] socket ${socket.id} joined geo_${geoId}`);
  });

  socket.on("leave_geofence_room", (geoId: string) => {
    socket.leave(`geo_${geoId}`);
    console.log(`[io] socket ${socket.id} left geo_${geoId}`);
  });

  // Example admin/global room join based on role
  if (role === "admin" || role === "tourism_officer") {
    socket.join("admin:alerts");
    console.log(`[io] socket ${socket.id} joined admin:alerts`);
  }

  socket.on("disconnect", () => {
    console.log("[io] socket disconnected", socket.id);
  });
});

// ---------- Alerts subscriber (Redis -> Prisma -> Socket.IO) ----------
startAlertsSubscriber(io); // this subscribes to `alerts` and will persist + emit via `io`

// ---------- Start server ----------
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
