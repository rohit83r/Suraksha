import React from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="w-full text-white px-6 py-4 shadow-md flex items-center justify-between  bg-gray-800 pl-6">
      <Link to="/">
      <div className="flex items-center space-x-2">
        {/* <img src={logo} alt="Suraksha" className="h-8 w-8" /> */}
        <span className="text-xl font-bold text-cyan-400">Sureksha</span>
    </div>
    
      </Link>
    </nav>
  );
};

export default Navbar;
