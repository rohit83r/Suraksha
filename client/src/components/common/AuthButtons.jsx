import React from "react";
import { Link } from "react-router-dom";


const AuthButtons = () => {
  return (
    <div className="flex space-x-4 mt-6">
      <Link to="/login">
      <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-full transition">
          Login / Sign Up
        </button>
      </Link>
      
    </div>
  );
};

export default AuthButtons;
