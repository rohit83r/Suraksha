import express from "express";
import prisma from "../prisma";
import { LatLng } from "../utils/geofence";

const router = express.Router();

// Create geofence
// POST /api/v1/geofences
// body: { name, description?, type: "POLYGON"|"CIRCLE", coords: [...], radiusMeters? , notifyAuthorities?, severity? }
router.post("/", async (req, res) => {
  try {
    const { name, description, type, coords, radiusMeters, notifyAuthorities, severity, createdById } = req.body;

    if (!name || !type || !coords) return res.status(400).json({ error: "Missing required fields" });

    // Basic validation
    if (type === "POLYGON") {
      if (!Array.isArray(coords) || coords.length < 3) return res.status(400).json({ error: "Polygon requires >= 3 vertices" });
    } else if (type === "CIRCLE") {
      if (!Array.isArray(coords) || coords.length < 1) return res.status(400).json({ error: "Circle requires center coords" });
      if (!radiusMeters) return res.status(400).json({ error: "Circle requires radiusMeters" });
    }

    const gf = await prisma.geoFence.create({
      data: {
        name,
        description,
        type,
        coords,
        radiusMeters: radiusMeters ?? null,
        notifyAuthorities: notifyAuthorities ?? true,
        severity: severity ?? 1,
        createdById: createdById ?? "system" // replace with req.user.id if auth middleware present
      }
    });

    return res.status(201).json(gf);
  } catch (err) {
    console.error("create geofence err", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/v1/geofences?active=true
router.get("/", async (req, res) => {
  const active = req.query.active === "false" ? false : true;
  const gfs = await prisma.geoFence.findMany({ where: { active } });
  res.json(gfs);
});

export default router;
