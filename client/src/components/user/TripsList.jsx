export default function TripsList({ trips }) {
  return (
    <div className="bg-[#020617] border border-white/10 rounded-xl p-6 max-h-[300px] overflow-y-auto">
      <h2 className="text-xl mb-4">All Trips</h2>

      {trips.map((t, i) => (
        <div key={i} className="border-b border-white/10 py-2">
          <p>{t.itenary.source} → {t.itenary.destination}</p>
          <p className="text-sm text-gray-400">{t.status}</p>
        </div>
      ))}
    </div>
  );
}
