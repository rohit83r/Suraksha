import { useState } from "react";

export default function TouristCard({ tourist }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0b1020] p-4 rounded mb-3">
      <div className="flex justify-between items-center">
        <p className="font-semibold">{tourist.id}</p>
        <button
          onClick={() => setOpen(!open)}
          className="text-cyan-400 text-sm"
        >
          {open ? "Show Less" : "Show More"}
        </button>
      </div>

      {open && (
        <div className="mt-2 text-sm text-gray-300 space-y-1">
          <p>Name: {tourist.name}</p>
          <p>Email: {tourist.email}</p>
          <p>Aadhar: {tourist.aadhar}</p>
          <p>Passport: {tourist.passport}</p>
          <p>Created: {tourist.createdAt}</p>
          <p>Updated: {tourist.updatedAt}</p>
        </div>
      )}
    </div>
  );
}
