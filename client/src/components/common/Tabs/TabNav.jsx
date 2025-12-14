import React from "react";

const TabNav = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 font-medium ${
            activeTab === tab
              ? "text-blue-300 border-b-2 border-blue-300"
              : "text-white hover:text-blue-400"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNav;
