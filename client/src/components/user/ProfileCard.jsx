import { useState } from "react";
import QRCode from "react-qr-code";

export default function ProfileCard({ profile, onSave }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);

  const handleSave = () => {
    onSave(form);
    setEdit(false);
  };

  return (
    <div className="bg-[#020617] border border-white/10 rounded-xl p-6 grid md:grid-cols-2 gap-6">
      {/* QR */}
      <div className="flex justify-center items-center">
        <QRCode value={JSON.stringify(profile)} size={160} />
      </div>

      {/* Info */}
      <div className="space-y-2">
        {["name", "email", "passportNumber", "aadhaarNumber"].map((key) => (
          <div key={key}>
            <label className="text-sm text-gray-400">{key}</label>
            <input
              disabled={!edit || key === "email"}
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-transparent border border-white/10 rounded px-3 py-1"
            />
          </div>
        ))}

        <p className="">
          Verified:{" "}
          <span className={profile.verified ? "text-green-400" : "text-red-400"}>
            {profile.verified ? "Yes" : "No"}
          </span>
        </p>

        {edit ? (
          <button onClick={handleSave} className="btn-primary">
            Save Profile
          </button>
        ) : (
          <button onClick={() => setEdit(true)} className="bg-cyan-400 hover:bg-blue-700 cursor-pointer px-4 py-2 rounded-md">
            Update Profile
          </button>
        )}
      </div>
    </div>
  );
}
