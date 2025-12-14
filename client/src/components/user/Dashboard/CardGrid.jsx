import React from 'react';
import FeatureCard from './FeatureCard';
import { NavLink } from 'react-router-dom';

const cardData = [
  { title: 'Profile', description: 'View and update your details.' },
  { title: 'Wearable & Emergency Contacts', description: 'Connect devices and manage your emergency numbers.' },
  { title: 'Map', description: 'Track your location and nearby safe zones.' },
  { title: 'File an FIR', description: 'File a First Information Report online.' },
  { title: 'Ask AI', description: 'Get real-time AI assistance.' },
  { title: 'Incident Response System using AI', description: 'AI powered analysis and response for emergencies.' },
  {title: '25', description: 'AI genrated Safe Score.'}
];

const CardGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        <NavLink to='/userprofile' >
        <FeatureCard key={1} title={cardData[0].title} description={cardData[0].description} />
        </NavLink>

        <NavLink to=''>
        <FeatureCard key={2} title={cardData[1].title} description={cardData[1].description} />
        </NavLink>

        <NavLink to='/map'>
        <FeatureCard key={3} title={cardData[2].title} description={cardData[2].description} />
        </NavLink>

        <NavLink to=''>
        <FeatureCard key={4} title={cardData[3].title} description={cardData[3].description} />
        </NavLink>

        <NavLink to=''>
        <FeatureCard key={5} title={cardData[4].title} description={cardData[4].description} />
        </NavLink>

        <NavLink to=''>
        <FeatureCard key={6} title={cardData[5].title} description={cardData[5].description} />
        </NavLink>

        <NavLink to=''>
        <FeatureCard key={7} title={cardData[6].title} description={cardData[6].description} />
        </NavLink>
        
    </div>
  );
};

export default CardGrid;

