import { useEffect, useRef, useState } from "react";
import MapView from "../../components/MapView.jsx";
import RightPanel from "../../components/RightPanels.jsx";
import AlertToast from "../../components/AlertToast.jsx";
// import { getActiveGeofences, sendLocationUpdate } from "../api/geofenceApi";
// import socket from "../sockets/sockets.js";

const LiveTrackingPage = () => {
  const [geofences, setGeofences] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [alert, setAlert] = useState(null);
  const watchIdRef = useRef(null);

  // Load geofences on page load
  useEffect(() => {
    // getActiveGeofences().then((res) => setGeofences(res.data));
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

  // Socket listener
  // useEffect(() => {
  //   socket.on("geofence_alert", (data) => {
  //     setAlert(data);
  //     setTimeout(() => setAlert(null), 5000);
  //   });

  //   return () => socket.off("geofence_alert");
  // }, []);

  const startSharing = () => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const location = {
          touristId: "tourist_001",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        console.log(location);

        setUserLocation(location);
        // await sendLocationUpdate(location);
      },
      console.error,
      { enableHighAccuracy: true }
    );
  };

  const stopSharing = () => {
    navigator.geolocation.clearWatch(watchIdRef.current);
    setSharing(false);
  };

  const toggleSharing = () => {
    if (!sharing) {
      setSharing(true);
      startSharing();
    } else {
      stopSharing();
    }
  };

  return (
     <div className="h-screen w-screen overflow-hidden">
<div className="h-full w-full flex bg-[#050b17]">
    
    {/* MAP SECTION */}
    <div className="flex-1 h-full p-4">
      <div className="h-full w-full rounded-2xl overflow-hidden bg-black">
        <MapView
          geofences={geofences}
          userLocation={userLocation}
        />
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="w-80 h-full bg-[#0b1220] text-white px-6 py-8 flex flex-col">
      <RightPanel sharing={sharing} onToggle={toggleSharing} />
    </div>

  </div>
    </div> 
  
);

};

export default LiveTrackingPage;
