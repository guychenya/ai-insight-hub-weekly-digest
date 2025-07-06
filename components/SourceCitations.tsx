import React from 'react';
import { GroundingSource } from '../types';
import { IconLink } from './IconComponents';

interface SourceCitationsProps {
  sources: GroundingSource[];
}

const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white text-center mb-4">
        Sources
      </h3>
      <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
        This digest was generated using information from the following web pages, provided by Google Search.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700 hover:border-blue-500/50 transition-all duration-200"
          >
            <IconLink className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-200 truncate" title={source.title}>
                {source.title}
              </p>
              <p className="text-sm text-blue-400 truncate" title={source.uri}>
                {source.uri}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceCitations;
