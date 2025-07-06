import React, { useState } from 'react';
import { AIResource } from '../types';
import { IconNewspaper, IconLink, IconTwitter, IconLinkedIn, IconStar, IconMessageCircle, IconChevronDown } from './IconComponents';

interface ProjectCardProps {
  resource: AIResource;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ resource, index }) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const animationDelay = `${index * 100}ms`;

  const hashtags = resource.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');

  const twitterText = `${resource.description.substring(0, 200)}... ${hashtags}`;
  const shareOnTwitterUrl = `https://x.com/intent/post?url=${encodeURIComponent(resource.url)}&text=${encodeURIComponent(twitterText)}`;
  
  // LinkedIn's modern sharing uses the URL for a rich preview and does not reliably pre-fill text.
  const shareOnLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resource.url)}`;

  return (
    <div
      className="bg-gray-800/70 border border-gray-700/80 rounded-xl shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay }}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3">
          <h2 className="text-2xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors duration-300 pr-4">
            {resource.title}
          </h2>
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-300 bg-purple-900/50 px-3 py-1 rounded-full mt-2 sm:mt-0 flex-shrink-0">
            <IconNewspaper className="w-4 h-4" />
            <span>{resource.sourceName}</span>
          </div>
        </div>
        
        <p className="text-gray-300 mb-5 leading-relaxed">
          {resource.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
             <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 font-mono text-sm font-bold"
            >
              <IconLink className="w-4 h-4 mr-1.5" />
              Read Source
            </a>
             <div className="h-4 border-l border-gray-600"></div>
              <div className="flex items-center gap-x-3">
                   <span className="text-sm font-semibold text-gray-400">Share:</span>
                   <a href={shareOnTwitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="text-gray-400 hover:text-white transition-colors duration-200">
                       <IconTwitter className="w-5 h-5" />
                   </a>
                   <a href={shareOnLinkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="text-gray-400 hover:text-white transition-colors duration-200">
                       <IconLinkedIn className="w-5 h-5" />
                   </a>
              </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map(tag => (
              <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-mono px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Interaction Footer */}
      <div className="bg-gray-800/50 border-t border-gray-700/80 px-6 py-3 flex items-center justify-between">
         {/* Rating Section */}
        <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <IconStar key={i} className="w-5 h-5" />)}
            </div>
            <span className="text-xs text-gray-400 font-mono">(0 ratings)</span>
        </div>
        
        {/* Comments Toggle */}
        <button 
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white font-semibold"
        >
            <IconMessageCircle className="w-5 h-5"/>
            <span>0 Comments</span>
            <IconChevronDown className={`w-4 h-4 transition-transform ${commentsVisible ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible Comments Section */}
      {commentsVisible && (
        <div className="border-t border-gray-700/80 p-6 animate-fade-in">
             <h4 className="font-bold text-lg mb-4">Comments</h4>
             <div className="text-center text-gray-500 py-4">
                <p>Commenting feature coming soon!</p>
             </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
