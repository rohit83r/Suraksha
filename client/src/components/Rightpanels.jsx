import { NavLink } from "react-router-dom";

const RightPanel = ({ sharing, onToggle }) => {
  return (
    <div className="w-80 h-full bg-[#0b1220] text-white px-6 py-8 flex flex-col gap-6 shadow-xl">
      <h2 className="text-2xl font-semibold text-cyan-400">
        Live Location Sharing
      </h2>

      <button
        onClick={onToggle}
        className={`py-3 rounded-lg font-semibold transition-all duration-200 ${
          sharing
            ? "bg-red-500 hover:bg-red-600"
            : "bg-cyan-500 hover:bg-cyan-600"
        }`}
      >
        {sharing ? "Stop Sharing" : "Share My Location"}
      </button>

      <div className="text-gray-400">
        {sharing ? "Tracking active..." : "Tracking stopped."}
      </div>
      
        <button className="mt-auto bg-gray-800 hover:bg-gray-400 transition py-3 rounded-lg">
          <NavLink to='/dashboard'>Back to Dashboard</NavLink>
      </button>
      
      
    </div>
  );
};

export default RightPanel;
