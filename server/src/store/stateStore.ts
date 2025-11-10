// state store abstraction: stores last "inside" | "outside" per tourist/geofence.
// Uses Redis (ioredis) if REDIS_URL is set, otherwise in-memory Map (dev).

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "";

type State = "inside" | "outside";
const MEMORY_MAP = new Map<string, State>();

let redisClient: Redis | null = null;
if (REDIS_URL) {
  redisClient = new Redis(REDIS_URL);
}

/** key format */
function key(touristId: string, geoId: string) {
  return `gf_state:${touristId}:${geoId}`;
}

export async function getLastState(touristId: string, geoId: string): Promise<State> {
  const k = key(touristId, geoId);
  if (redisClient) {
    const v = await redisClient.get(k);
    return (v as State) ?? "outside";
  } else {
    return MEMORY_MAP.get(k) ?? "outside";
  }
}

export async function setLastState(touristId: string, geoId: string, s: State) {
  const k = key(touristId, geoId);
  if (redisClient) {
    // set with TTL so stale states auto-expire (e.g., 24h)
    await redisClient.set(k, s, "EX", 60 * 60 * 24);
  } else {
    MEMORY_MAP.set(k, s);
  }
}
