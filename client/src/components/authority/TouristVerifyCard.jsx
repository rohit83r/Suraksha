import React from "react";

const TouristVerifyCard = ({ tourist, onApprove, onCancel }) => {
    // console.log(tourist);
  return (
    <div className="flex justify-between items-center bg-gray-500 shadow-md rounded-lg p-4 mb-4">
      
      {/* Left Section - Tourist Details */}
      <div className="space-y-1">
        <p className="font-semibold text-lg">{tourist.name}</p>
        <p className="text-sm text-white">Email: {tourist.email}</p>
        <p className="text-sm text-white">
          Passport: {tourist.passportNumber}
        </p>
        <p className="text-sm text-white">
          Aadhaar: {tourist.aadhaarNumber}
        </p>
      </div>

      {/* Right Section - Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onApprove(tourist._id)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Approve
        </button>

        <button
          onClick={() => onCancel(tourist._id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TouristVerifyCard;
