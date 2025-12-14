import React from 'react';
import NavBar from './Navbar';
import SOSButton from './SOSButton';
import CardGrid from './CardGrid';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100">
      <NavBar />
      <div className="flex flex-col flex-1 p-4 gap-6">
        <div className="flex justify-center items-center h-2/5">
          <SOSButton />
        </div>
        <div className="flex justify-center items-center h-3/5">
          <CardGrid />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

