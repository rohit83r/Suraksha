import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import MapCanvas from "../../components/MapCanvas";

export default function GeoFenceAdminPage() {
  const [geofences, setGeofences] = useState([]);
  const [tempZones, setTempZones] = useState([]);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    // axios.get("/api/v1/geofences?active=true")
    //   .then(res => setGeofences(res.data))
    //   .catch(err => console.error(err));
        const dummyGeofences = [
    {
      id: "gf_circle_1",
      name: "Kaziranga National Park",
      description: "Protected wildlife zone",
      type: "CIRCLE",
      coords: [
        { lat: 26.5775, lng: 93.1711 } // center
      ],
      radiusMeters: 5000,
      severity: 3,
      active: true
    },
    {
      id: "gf_circle_2",
      name: "Tawang Monastery Zone",
      description: "High altitude restricted area",
      type: "CIRCLE",
      coords: [
        { lat: 27.5859, lng: 91.8594 }
      ],
      radiusMeters: 3000,
      severity: 2,
      active: true
    },
    {
      id: "gf_polygon_1",
      name: "Guwahati City Limits",
      description: "Urban monitoring area",
      type: "POLYGON",
      coords: [
        { lat: 26.2156, lng: 91.7362 },
        { lat: 26.2000, lng: 91.8000 },
        { lat: 26.1400, lng: 91.8200 },
        { lat: 26.1200, lng: 91.7400 },
        { lat: 26.1500, lng: 91.7000 }
      ],
      severity: 1,
      active: true
    },
    {
      id: "gf_polygon_2",
      name: "Shillong Restricted Zone",
      description: "Military sensitive area",
      type: "POLYGON",
      coords: [
        { lat: 25.5788, lng: 91.8820 },
        { lat: 25.5900, lng: 91.9100 },
        { lat: 25.5600, lng: 91.9300 },
        { lat: 25.5450, lng: 91.9000 }
      ],
      severity: 4,
      active: true
    }
  ];
  setGeofences(dummyGeofences);
  }, []);

  const saveZone = async (zone) => {
    // await axios.post("/api/v1/geofences", {
    //   ...zone,
    //   name: "Admin Zone",
    //   notifyAuthorities: true,
    //   severity: 2,
    // });
    console.log(zone);

    setTempZones(prev => prev.filter(z => z !== zone));
  };

  const deleteZone = (index) => {
    setTempZones(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="h-screen w-screen flex bg-[#020617] p-4">
      <AdminSidebar
        mode={mode}
        setMode={setMode}
        tempZones={tempZones}
        onSaveZone={saveZone}
        onDeleteZone={deleteZone}
      />

      <div className="flex-1 pl-4">
        <MapCanvas
          geofences={geofences}
          tempZones={tempZones}
          setTempZones={setTempZones}
          mode={mode}
        />
      </div>
    </div>
    </div> 
    
  );
}
