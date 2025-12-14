import React, { useEffect, useState } from "react";
import TouristVerifyCard from "../../components/authority/TouristVerifyCard";
import {
  getUnverifiedTourists,
  approveTourist,
} from "../../api/verifyApi";

const VerifyTourist = () => {
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on render
  useEffect(() => {
    const fetchTourists = async () => {
      try {
        // const res = await getUnverifiedTourists();
        const dummyUnverifiedTourists = [
  {
    _id: "t001",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    passportNumber: "N1234567",
    aadhaarNumber: "1234-5678-9012",
  },
  {
    _id: "t002",
    name: "Ananya Verma",
    email: "ananya.verma@gmail.com",
    passportNumber: "M7654321",
    aadhaarNumber: "2345-6789-0123",
  },
  {
    _id: "t003",
    name: "Karan Mehta",
    email: "karan.mehta@gmail.com",
    passportNumber: "P9988776",
    aadhaarNumber: "3456-7890-1234",
  },
  {
    _id: "t004",
    name: "Sneha Iyer",
    email: "sneha.iyer@gmail.com",
    passportNumber: "Z4455667",
    aadhaarNumber: "4567-8901-2345",
  },
  {
    _id: "t005",
    name: "Amit Patel",
    email: "amit.patel@gmail.com",
    passportNumber: "L1122334",
    aadhaarNumber: "5678-9012-3456",
  },
            ];


        setTourists(dummyUnverifiedTourists);
      } catch (err) {
        console.error("Error fetching tourists", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTourists();
  }, []);

  // Remove tourist from UI
  const removeFromList = (id) => {
    setTourists((prev) => prev.filter((t) => t._id !== id));
    console.log("Tourist ID:", id);
  };

  // Approve handler
  const handleApprove = async (id) => {
    try {
    //   await approveTourist(id);
      removeFromList(id);
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  // Cancel handler
  const handleCancel = (id) => {
    removeFromList(id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }
//   console.log(tourists)

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-4">Verify Tourists</h1>

      {/* Scrollable Container */}
      <div className="max-h-[75vh] overflow-y-auto pr-2">
        {tourists.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No unverified tourists
          </p>
        ) : (
          tourists.map((tourist) => (
            <TouristVerifyCard
              key={tourist._id}
              tourist={tourist}
              onApprove={handleApprove}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VerifyTourist;
