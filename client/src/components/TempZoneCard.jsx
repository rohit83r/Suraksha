export default function TempZoneCard({ zone, onSave, onDelete }) {
  return (
    <div className="bg-[#111827] p-3 rounded mb-2">
      <p className="text-sm">{zone.type}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={onSave}
          className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          onClick={onDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

