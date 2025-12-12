// server/src/alerts/alertsSubscriber.ts
import Redis from "ioredis";
import { PrismaClient, AlertType } from "../generated/prisma/client";
import { Server as SocketIOServer } from "socket.io";

const prisma = new PrismaClient();

export function startAlertsSubscriber(io: SocketIOServer) {
  const sub = new Redis(process.env.REDIS_URL as string);

  sub.subscribe("alerts", (err, count) => {
    if (err) {
      console.error("[alertsSubscriber] subscribe error", err);
      return;
    }
    console.log(`[alertsSubscriber] subscribed to 'alerts' (${count})`);
  });

  sub.on("message", async (_channel: string, message: string) => {
    try {
      const alert = JSON.parse(message);

      const touristId = alert.touristId;
      if (!touristId) {
        console.warn("[alertsSubscriber] alert missing touristId", alert);
        return;
      }

      // Normalize fields with safe fallbacks
      const lat = parseFloat(String(alert.lat ?? 0));
      const lng = parseFloat(String(alert.lng ?? 0));
      const typeStr = String(alert.type ?? "ANOMALY");
      // Map incoming type to our AlertType enum where possible
      const mappedType = (Object.values(AlertType) as string[]).includes(typeStr)
        ? (typeStr as AlertType)
        : AlertType.GPS_LOSS;

      // Persist the alert
      const dbAlert = await prisma.alert.create({
        data: {
          touristId: touristId,
          geoFenceId: alert.geoFenceId ?? null,
          lat,
          lng,
          type: mappedType,
          message: alert.message ?? null
        }
      });

      // Emit to tourist room and admin/global channels
      io.to(`tourist:${touristId}`).emit("anomaly_alert", dbAlert);
      io.emit("anomaly_alert_global", dbAlert);

      console.log("[alertsSubscriber] saved + emitted alert", { touristId, id: dbAlert.id, type: mappedType });
    } catch (e) {
      console.error("[alertsSubscriber] processing error:", e);
    }
  });

  return sub;
}
