
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-300">Generating AI Digest...</p>
      <p className="text-sm text-gray-500">This may take a moment.</p>
    </div>
  );
};

export default Loader;
