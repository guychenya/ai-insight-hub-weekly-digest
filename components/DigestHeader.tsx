
import React from 'react';

const DigestHeader: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pb-2">
        AI Insight Hub
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mt-2">
        Your Weekly Digest of Trending AI Projects
      </p>
    </header>
  );
};

export default DigestHeader;
