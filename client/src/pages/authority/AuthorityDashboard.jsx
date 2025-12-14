import { useEffect, useState } from "react";
import Navbar from "../../components/authority/Navbar";
import MapPanel from "../../components/authority/MapPanel";
import Tabs from "../../components/authority/Tabs";
import TouristCard from "../../components/authority/TouristCard";
import {
  getTourists,
  getNotifications,
  getTravelHistory,
} from "../../api/authorityApi";

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState("Tourists");
  const [tourists, setTourists] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [geofences, setGeofences] = useState([]);

  useEffect(() => {
    getTourists().then(setTourists);
    getNotifications().then(setNotifications);
    getTravelHistory().then(setHistory);
  }, []);

  return (
    // 🔵 ROOT WRAPPER (page background + scroll)
    <div className="min-h-screen bg-[#020617] text-white">

      {/* 🟣 STICKY NAVBAR (does NOT scroll away) */}
      <Navbar />

      {/* 🟢 SCROLLABLE PAGE CONTENT */}
      <div className="px-10 md:px-8 py-6 space-y-6">

        {/* 🔹 MAP SECTION */}
        <MapPanel
          tourists={tourists}
          geofences={geofences}
        />

        {/* 🔹 TABS NAVIGATION */}
        <Tabs
          active={activeTab}
          setActive={setActiveTab}
        />

        {/* 🔹 TAB CONTENT */}
        <div>
          {/* TOURISTS TAB */}
          {activeTab === "Tourists" && (
            <div className="max-h-[260px] overflow-y-auto space-y-3">
              {tourists.map(t => (
                <TouristCard key={t.id} tourist={t} />
              ))}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "Notifications" && (
            <div className="max-h-[260px] overflow-y-auto space-y-2">
              {notifications.map((n, i) => (
                <div key={i} className="bg-[#0b1020] p-3 rounded">
                  {n}
                </div>
              ))}
            </div>
          )}

          {/* TRAVEL HISTORY TAB */}
          {activeTab === "Travel History" && (
            <div className="max-h-[260px] overflow-y-auto space-y-2">
              {history.map((h, i) => (
                <div key={i} className="bg-[#0b1020] p-3 rounded text-sm">
                  {h}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      {/* 🟢 END OF SCROLLABLE CONTENT */}

    </div>
    // 🔵 END OF ROOT
  );
}
