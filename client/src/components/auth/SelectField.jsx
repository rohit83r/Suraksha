import React from "react";

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-gray-800/70 text-white 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
