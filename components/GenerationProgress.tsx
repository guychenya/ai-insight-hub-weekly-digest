import React, { useState, useEffect } from 'react';
import { IconSparkles, IconLink, IconCheckCircle } from './IconComponents';

interface GenerationProgressProps {
  isGenerating: boolean;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ isGenerating }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Connecting to AI sources",
      description: "Initializing connection to Google Gemini AI...",
      icon: IconSparkles,
      duration: 2000
    },
    {
      id: 2,
      title: "Searching for trending AI news",
      description: "Scanning X, TechCrunch, Hacker News, and other sources...",
      icon: IconLink,
      duration: 3000
    },
    {
      id: 3,
      title: "Analyzing content",
      description: "Processing and ranking AI developments by significance...",
      icon: IconSparkles,
      duration: 2000
    },
    {
      id: 4,
      title: "Generating insights",
      description: "Creating comprehensive AI news digest...",
      icon: IconSparkles,
      duration: 2000
    },
    {
      id: 5,
      title: "Saving to database",
      description: "Storing new articles and updating the digest...",
      icon: IconCheckCircle,
      duration: 1000
    }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let timeouts: NodeJS.Timeout[] = [];
    let cumulativeDuration = 0;

    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index + 1);
        if (index > 0) {
          setCompletedSteps(prev => [...prev, index]);
        }
      }, cumulativeDuration);
      
      timeouts.push(timeout);
      cumulativeDuration += step.duration;
    });

    // Final completion
    const finalTimeout = setTimeout(() => {
      setCompletedSteps(prev => [...prev, steps.length]);
    }, cumulativeDuration);
    timeouts.push(finalTimeout);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Generating AI Insights</h3>
        <p className="text-gray-400">Please wait while we gather the latest AI developments...</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === index + 1;
          const isCompleted = completedSteps.includes(index + 1);
          const isPending = currentStep < index + 1;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-500 ${
                isActive
                  ? 'bg-blue-900/30 border border-blue-500/30'
                  : isCompleted
                  ? 'bg-green-900/20 border border-green-500/20'
                  : 'bg-gray-700/30'
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <IconCheckCircle className="w-5 h-5" />
                ) : (
                  <StepIcon className={`w-5 h-5 ${isActive ? 'animate-spin' : ''}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`font-semibold transition-colors duration-300 ${
                    isCompleted
                      ? 'text-green-300'
                      : isActive
                      ? 'text-blue-300'
                      : isPending
                      ? 'text-gray-500'
                      : 'text-gray-300'
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-sm mt-1 transition-colors duration-300 ${
                    isCompleted
                      ? 'text-green-400/80'
                      : isActive
                      ? 'text-blue-400/80'
                      : isPending
                      ? 'text-gray-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Progress bar for active step */}
              {isActive && (
                <div className="flex-shrink-0 w-20">
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 animate-pulse w-3/5" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;