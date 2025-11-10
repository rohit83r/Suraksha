import express from "express";
import prisma from "../prisma";
import { LatLng, pointInPolygon, haversineDistance } from "../utils/geofence";
import { getLastState, setLastState } from "../store/stateStore";
import { Server as IOServer } from "socket.io";

const routerFactory = (io: IOServer) => {
  const router = express.Router();

  /**
   * POST /api/v1/location/update
   * body: { touristId, lat, lng, accuracy? }
   */
  router.post("/update", async (req, res) => {
    try {
      const { touristId, lat, lng, accuracy } = req.body as { touristId: string; lat: number; lng: number; accuracy?: number };
      if (!touristId || typeof lat !== "number" || typeof lng !== "number") {
        return res.status(400).json({ error: "Missing touristId / lat / lng" });
      }

      const point: LatLng = { lat, lng };

      // 1) Upsert latest location
      await prisma.touristLocation.upsert({
        where: { touristId },
        create: { touristId, lat, lng, accuracy: accuracy ?? null },
        update: { lat, lng, accuracy: accuracy ?? null }
      });

      // 2) Fetch active geofences (could be optimized to only fetch nearby geofences; for now fetch all)
      const geofences = await prisma.geoFence.findMany({ where: { active: true } });

      // 3) For each geofence, run appropriate geometric check & state transition
      for (const gf of geofences) {
        let inside = false;

        if (gf.type === "CIRCLE") {
          // coords: expect first element to be center {lat,lng}
          const coords = gf.coords as any;
          const center = coords && coords[0] ? coords[0] as LatLng : null;
          if (!center) continue; // malformed, skip
          const dist = haversineDistance(point, center);
          inside = dist <= (gf.radiusMeters ?? 0);
        } else { // POLYGON
          const polygon = gf.coords as any as LatLng[];
          if (!Array.isArray(polygon) || polygon.length < 3) continue; // malformed
          inside = pointInPolygon(point, polygon);
        }

        // Get last state
        const last = await getLastState(touristId, gf.id); // "inside" | "outside"

        // Debounce/confirmation strategy (simple prototype): require a transition only if different
        if (inside && last !== "inside") {
          // ENTERED transition
          await setLastState(touristId, gf.id, "inside");
          const alert = await prisma.alert.create({
            data: {
              touristId,
              geoFenceId: gf.id,
              lat: point.lat,
              lng: point.lng,
              type: "ENTERED_GEOFENCE",
              message: `Tourist ${touristId} entered ${gf.name}`
            }
          });
          // emit to room geo_<gf.id>
          io.to(`geo_${gf.id}`).emit("geofence_alert", {
            alertId: alert.id,
            touristId,
            geoFenceId: gf.id,
            name: gf.name,
            lat: point.lat,
            lng: point.lng,
            type: "ENTERED_GEOFENCE",
            severity: gf.severity,
            timestamp: alert.createdAt
          });
        } else if (!inside && last === "inside") {
          // EXITED transition
          await setLastState(touristId, gf.id, "outside");
          const alert = await prisma.alert.create({
            data: {
              touristId,
              geoFenceId: gf.id,
              lat: point.lat,
              lng: point.lng,
              type: "EXITED_GEOFENCE",
              message: `Tourist ${touristId} exited ${gf.name}`
            }
          });
          io.to(`geo_${gf.id}`).emit("geofence_alert", {
            alertId: alert.id,
            touristId,
            geoFenceId: gf.id,
            name: gf.name,
            lat: point.lat,
            lng: point.lng,
            type: "EXITED_GEOFENCE",
            severity: gf.severity,
            timestamp: alert.createdAt
          });
        }
        // else: no change -> do nothing
      }

      return res.json({ ok: true });
    } catch (err) {
      console.error("location update error", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};

export default routerFactory;
