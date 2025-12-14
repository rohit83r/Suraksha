export default function CurrentTrip({ trip }) {
  if (!trip) return null;

  return (
    <div className="bg-[#020617] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl mb-2">Current Trip</h2>
      <p>Status: {trip.status}</p>
      <p>
        {trip.itenary.source} → {trip.itenary.destination} ({trip.itenary.type})
      </p>
      <p>
        {trip.startDate} - {trip.endDate}
      </p>
    </div>
  );
}
