import React from "react";

const InputField = ({ label, type, name, value, onChange, required, maxLength }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      className="w-full px-4 py-2 rounded-lg bg-gray-800/70 text-white 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                 placeholder-gray-400 transition"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

export default InputField;
