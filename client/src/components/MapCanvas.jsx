import { MapContainer, TileLayer, Polygon, Circle, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function MapCanvas({
  geofences,
  tempZones,
  setTempZones,
  mode,
}) {

  // Normalize backend geofences → Leaflet safe format
  const normalized = geofences
    .map(g => {
      if (g.type === "POLYGON" && Array.isArray(g.coords) && g.coords.length >= 3) {
        return {
          ...g,
          leafletCoords: g.coords.map(p => [p.lat, p.lng]),
        };
      }

      if (g.type === "CIRCLE" && Array.isArray(g.coords) && g.coords[0]) {
        return {
          ...g,
          center: [g.coords[0].lat, g.coords[0].lng],
        };
      }

      return null;
    })
    .filter(Boolean);

  const onCreated = (e) => {
    const { layerType, layer } = e;
    let zone = null;

    if (layerType === "polygon") {
      const latlngs = layer.getLatLngs();
      if (!latlngs?.[0] || latlngs[0].length < 3) return;

      zone = {
        type: "POLYGON",
        coords: latlngs[0].map(p => ({
          lat: p.lat,
          lng: p.lng,
        })),
      };
    }

    if (layerType === "circle") {
      const center = layer.getLatLng();
      zone = {
        type: "CIRCLE",
        coords: [{ lat: center.lat, lng: center.lng }],
        radiusMeters: layer.getRadius(),
      };
    }

    if (zone) {
      setTempZones(prev => [...prev, zone]);
    }
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Existing Geofences */}
        {normalized.map((g, i) => (
          g.type === "POLYGON" ? (
            <Polygon
              key={i}
              positions={g.leafletCoords}
              pathOptions={{ color: "cyan" }}
            />
          ) : (
            <Circle
              key={i}
              center={g.center}
              radius={g.radiusMeters}
              pathOptions={{ color: "cyan" }}
            />
          )
        ))}

        {/* Draw Controls */}
        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={onCreated}
            draw={{
              polygon: mode === "polygon",
              circle: mode === "circle",
              rectangle: false,
              polyline: false,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>

      </MapContainer>
    </div>
  );
}

