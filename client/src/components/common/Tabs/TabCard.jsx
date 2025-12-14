import React from "react";

const TabCard = ({ heading, description }) => {
  return (
    <div className="bg-gray-700 shadow-md rounded-lg p-6 mt-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">{heading}</h1>
        <p className="text-lg md:text-xl mb-6 text-gray-300 max-w-xl">
          {description}
        </p>
    </div>
  );
};

export default TabCard;
