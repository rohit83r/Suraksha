import { MapContainer, TileLayer, Circle, Polygon, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ geofences, userLocation }) => {
  console.log("map loading properly")
  console.log(geofences);
  return (
    <MapContainer
      center={[26.5, 93.7]}
      zoom={6}
      // style={{ height: "100%", width: "100%" }}
      className="h-full w-full rounded-xl border-4 border-red-500"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render Geofences */}
      {geofences.map((gf) =>
        gf.type === "CIRCLE" ? (
          <Circle
            key={gf.id}
            center={[gf.coords[0].lat, gf.coords[0].lng]}
            radius={gf.radiusMeters}
            pathOptions={{ color: "cyan" }}
          />
        ) : (
          <Polygon
            key={gf.id}
            positions={gf.coords.map((c) => [c.lat, c.lng])}
            pathOptions={{ color: "cyan" }}
          />
        )
      )}

      {/* User Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} />
      )}
    </MapContainer>
  );
};

export default MapView;
