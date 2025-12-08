// geometry helpers for geofence checks
export type LatLng = { lat: number; lng: number };

/** Convert degrees to radians */
export function deg2rad(deg: number): number {
  return deg * Math.PI / 180;
}

/**
 * Haversine formula: distance in meters between two lat/lng points.
 * Step-by-step arithmetic for safety.
 */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371000; // Earth radius in meters

  const phi1 = deg2rad(a.lat);
  const phi2 = deg2rad(b.lat);
  const dPhi = deg2rad(b.lat - a.lat);
  const dLambda = deg2rad(b.lng - a.lng);

  const sinDPhi = Math.sin(dPhi / 2);
  const sinDLambda = Math.sin(dLambda / 2);

  const aHarv = sinDPhi * sinDPhi + Math.cos(phi1) * Math.cos(phi2) * sinDLambda * sinDLambda;
  const c = 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));

  const distance = R * c;
  return distance; // meters
}

/**
 * Ray-casting point-in-polygon.
 * polygon: array of vertices [{lat,lng}, ...] (non-self-intersecting)
 * Returns true if point is strictly inside or on the edge (treated as inside).
 */
export function pointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    // Check if edge intersects with ray to the right of point
    const intersects = ((yi > y) !== (yj > y)) &&
      (x < xi + (xj - xi) * ( (y - yi) / (yj - yi) ) );

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}
