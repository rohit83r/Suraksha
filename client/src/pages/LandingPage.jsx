import React from "react";
import Navbar from "../components/common/Navbar";
import Layout from "../components/common/Layout";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col text-white font-sans bg-gray-900">
      <Navbar />
      <Layout />
    </div>
  );
};

export default LandingPage;


