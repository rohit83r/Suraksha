import { useEffect, useState } from "react";
import Navbar from "../../components/user/Navbar";
import ProfileCard from "../../components/user/ProfileCard";
import EmergencyContacts from "../../components/user/EmergencyContacts";
import CurrentTrip from "../../components/user//CurrentTrip";
import TripsList from "../../components/user//TripsList";
import {
  getUserProfile,
  updateProfile,
  deleteProfile
} from "../../api/touristApi";

export default function UserProfilePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // getUserProfile().then((res) => setData(res.data));
    const dummyUserProfileResponse = {
  profile: {
    name: "Rohit Sharma",
    email: "rohit.sharma@gmail.com",
    passportNumber: "N1234567",
    aadhaarNumber: "1234-5678-9012",
    verified: true,
    emergencyContacts: [
      {
        name: "Anita Sharma",
        phone: "+91-9876543210",
        relation: "Mother"
      },
      {
        name: "Vikram Sharma",
        phone: "+91-9123456780",
        relation: "Brother"
      }
    ],
    createdAt: "2024-01-15T10:22:30.000Z",
    updatedAt: "2024-06-20T08:15:10.000Z"
  },

  trips: [
    {
      touristId: "tourist_97854",
      startDate: "2025-01-10",
      endDate: "2025-01-18",
      itenary: {
        source: "Delhi",
        destination: "Kolkata",
        type: "Flight"
      },
      status: "ACTIVE",
      createdAt: "2025-01-09T09:00:00.000Z",
      updatedAt: "2025-01-14T11:45:00.000Z"
    },
    {
      touristId: "tourist_97854",
      startDate: "2024-11-02",
      endDate: "2024-11-12",
      itenary: {
        source: "Mumbai",
        destination: "Goa",
        type: "Train"
      },
      status: "COMPLETED",
      createdAt: "2024-10-25T12:10:00.000Z",
      updatedAt: "2024-11-12T19:30:00.000Z"
    },
    {
      touristId: "tourist_97854",
      startDate: "2024-07-05",
      endDate: "2024-07-20",
      itenary: {
        source: "Bangalore",
        destination: "Leh",
        type: "Flight"
      },
      status: "COMPLETED",
      createdAt: "2024-06-20T14:00:00.000Z",
      updatedAt: "2024-07-20T17:45:00.000Z"
    }
  ]
};
    setData(dummyUserProfileResponse);

  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <div className="px-6 py-6 space-y-6">
        <ProfileCard profile={data.profile} onSave={updateProfile} />

        <EmergencyContacts
          contactsData={data.profile.emergencyContacts}
        />

        <CurrentTrip trip={data.trips.find((t) => t.status === "ACTIVE")} />

        <TripsList trips={data.trips} />

        <button
          onClick={() => {
            if (confirm("Delete profile permanently?")) deleteProfile();
          }}
          className="bg-red-700 px-6 py-2 rounded-md"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}
