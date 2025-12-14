import React, { useState } from "react";
import EarthModel from "./EarthModel";
import TabNav from "./Tabs/TabNav";
import TabContent from "./Tabs/TabContent";
import AuthButtons from "./AuthButtons";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const tabs = ["Home", "About", "Contact", "Features"];

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col md:flex-row items-center justify-between px-8 py-16 gap-10">
      {/* Left Half */}
      <div className="md:w-1/2 h-full w-full ml-4 mt-4 bg-blue-300 flex items-center justify-center">
        <EarthModel />
      </div>

      {/* Right Half */}
      <div className="md:w-1/2 w-full flex flex-col justify-between bg-gray-700 p-8">
        <div className="bg-gray-700">
          <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent activeTab={activeTab} />
        </div>
        <div>
          <AuthButtons />
        </div>
      </div>
    </div>
  );
};

export default Layout;
