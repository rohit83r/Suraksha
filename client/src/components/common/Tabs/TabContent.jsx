import React from "react";
import TabCard from "./TabCard";

const content = {
  Home: { heading: "Secure Travels, Smart Protection.", description: "Leveraging AI and Geo-Fencing to create a safer, smarter travel experience for everyone, everywhere." },
  About: { heading: "Our Mission", description: "Suraksha is dedicated to ensuring tourist safety across the globe through a synergistic blend of cutting-edge AI and real-time geo-fenced monitoring." },
  Contact: { heading: "Contact", description: "Reach us anytime." },
  Features: { heading: "Core Technologies", description: "Our platform is built on three pillars: Artificial Intelligence for threat prediction, Blockchain for secure data, and Geo-Fencing for real-time location-based alerts." },
};

const TabContent = ({ activeTab }) => {
  const { heading, description } = content[activeTab];
  return <TabCard heading={heading} description={description} />;
};

export default TabContent;
