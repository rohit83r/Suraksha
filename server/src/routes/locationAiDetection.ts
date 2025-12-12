import { Router, Request, Response } from "express";
import Redis from "ioredis";
import { PrismaClient } from "../generated/prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL as string);

const LocationSchema = z.object({
  touristId: z.string().uuid(),
  tripId: z.string().uuid().optional().nullable(),
  deviceId: z.string().optional().nullable(),
  lat: z.number(),
  lng: z.number(),
  speed: z.number().optional().nullable(),
  bearing: z.number().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  status: z.string().optional().nullable(),
  ts: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid timestamp" })
});

type LocationPayload = z.infer<typeof LocationSchema> & { id?: string };

const router = Router();

router.post("/api/location", async (req: Request, res: Response) => {
  try {
    const parsed = LocationSchema.parse(req.body as unknown);
    const pingId = uuidv4();

    const payload: LocationPayload = {
      id: pingId,
      touristId: parsed.touristId,
      tripId: parsed.tripId ?? null,
      deviceId: parsed.deviceId ?? null,
      lat: parsed.lat,
      lng: parsed.lng,
      speed: parsed.speed ?? null,
      bearing: parsed.bearing ?? null,
      accuracy: parsed.accuracy ?? null,
      status: parsed.status ?? null,
      ts: new Date(parsed.ts).toISOString()
    };

    // Persist raw ping
    await prisma.locationPing.create({
      data: {
        id: pingId,
        touristId: payload.touristId,
        tripId: payload.tripId ?? undefined,
        deviceId: payload.deviceId ?? undefined,
        lat: payload.lat,
        lng: payload.lng,
        speed: payload.speed ?? undefined,
        bearing: payload.bearing ?? undefined,
        accuracy: payload.accuracy ?? undefined,
        status: payload.status ?? undefined,
        ts: new Date(payload.ts)
      }
    });

    // Upsert the latest TouristLocation (one-to-one)
    await prisma.touristLocation.upsert({
      where: { touristId: payload.touristId },
      create: {
        touristId: payload.touristId,
        lat: payload.lat,
        lng: payload.lng,
        accuracy: payload.accuracy ?? undefined
      },
      update: {
        lat: payload.lat,
        lng: payload.lng,
        accuracy: payload.accuracy ?? undefined
      }
    });

    // Publish the payload to Redis for ML worker / downstream
    await redis.publish("locations", JSON.stringify(payload));

    return res.status(201).json({ ok: true, id: pingId });
  } catch (err: any) {
    console.error("location ingest error:", err);
    if (err?.issues) {
      return res.status(400).json({ ok: false, error: err.issues });
    }
    return res.status(500).json({ ok: false, error: err?.message ?? "internal" });
  }
});

export default router;
