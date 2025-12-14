import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPanel({ tourists, geofences }) {

  const safeGeofences = geofences
    .map(g => {
      if (g.type === "POLYGON" && g.coords?.length >= 3) {
        return { ...g, poly: g.coords.map(p => [p.lat, p.lng]) };
      }
      if (g.type === "CIRCLE" && g.coords?.[0]) {
        return { ...g, center: [g.coords[0].lat, g.coords[0].lng] };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="h-[420px] w-full rounded-xl overflow-hidden">
      <MapContainer center={[22.97, 78.65]} zoom={5} className="h-full w-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Geofences */}
        {safeGeofences.map((g, i) =>
          g.type === "POLYGON" ? (
            <Polygon key={i} positions={g.poly} pathOptions={{ color: "red" }} />
          ) : (
            <Circle key={i} center={g.center} radius={g.radiusMeters} pathOptions={{ color: "red" }} />
          )
        )}

        {/* Tourists */}
        {tourists.map(t => (
          <Marker key={t.id} position={[t.lat, t.lng]}>
            <Popup>
              <p className="font-semibold">{t.id}</p>
              <p className="text-xs">{t.name}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
