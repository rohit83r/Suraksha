export default function AdminSidebar({
  mode,
  setMode,
  tempZones,
  onSaveZone,
  onDeleteZone,
}) {
  return (
    <div className="w-[320px] h-full bg-[#0b1020] text-white p-4 flex flex-col gap-4 rounded-l-2xl">

      <h2 className="text-xl font-bold text-cyan-400">Geo-Fence Admin</h2>

      {/* Drawing Controls */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setMode("polygon")}
          className={`py-2 rounded ${mode === "polygon" ? "bg-cyan-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
        >
          Draw Polygon
        </button>

        <button
          onClick={() => setMode("circle")}
          className={`py-2 rounded ${mode === "circle" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          Draw Circle
        </button>
      </div>

      {/* Temporary Zones */}
      <div className="flex-1 overflow-y-auto mt-2">
        <h3 className="font-semibold mb-2">Temporary Zones</h3>

        {tempZones.length === 0 && (
          <p className="text-sm text-gray-400">No zones drawn</p>
        )}

        {tempZones.map((z, idx) => (
          <div key={idx} className="bg-[#111827] p-3 rounded mb-2">
            <p className="text-sm">
              {z.type} Zone
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onSaveZone(z)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={() => onDeleteZone(idx)}
                className="flex-1 bg-red-600 hover:bg-red-700 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-2">
        <button className="bg-cyan-700 hover:bg-cyan-800 py-2 rounded">
          View Live Emergencies
        </button>
        <button className="bg-cyan-700 hover:bg-cyan-800 py-2 rounded">
          View Reported Incidents
        </button>
      </div>

    </div>
  );
}

