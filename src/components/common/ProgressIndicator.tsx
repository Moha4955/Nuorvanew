import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  steps?: string[];
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  steps = [],
  showLabels = true,
  size = 'md',
  variant = 'default'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          circle: 'w-6 h-6',
          text: 'text-xs',
          connector: 'h-0.5'
        };
      case 'lg':
        return {
          circle: 'w-12 h-12',
          text: 'text-base',
          connector: 'h-1'
        };
      default:
        return {
          circle: 'w-8 h-8',
          text: 'text-sm',
          connector: 'h-0.5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < current) return 'completed';
    if (stepIndex === current) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500';
      case 'current':
        return 'bg-blue-500 text-white border-blue-500';
      case 'upcoming':
        return 'bg-white text-gray-400 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {Array.from({ length: total }, (_, index) => {
            const status = getStepStatus(index);
            return (
              <div
                key={index}
                className={`${sizeClasses.circle} rounded-full border-2 flex items-center justify-center ${getStepColor(status)}`}
              >
                {status === 'completed' ? (
                  <CheckCircle size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />
                ) : (
                  <span className={`font-medium ${sizeClasses.text}`}>
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <span className={`${sizeClasses.text} text-gray-600 font-medium`}>
          {current + 1} of {total}
        </span>
      </div>
    );
  }

  return (
    <div className="progress-indicator">
      <div className="flex items-center justify-between">
        {Array.from({ length: total }, (_, index) => {
          const status = getStepStatus(index);
          const stepLabel = steps[index] || `Step ${index + 1}`;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`${sizeClasses.circle} rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getStepColor(status)}`}
                >
                  {status === 'completed' ? (
                    <CheckCircle size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />
                  ) : (
                    <span className={`font-medium ${sizeClasses.text}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                {showLabels && (
                  <div className="mt-2 text-center">
                    <div className={`${sizeClasses.text} font-medium ${
                      status === 'current' ? 'text-blue-600' : 
                      status === 'completed' ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {stepLabel}
                    </div>
                  </div>
                )}
              </div>
              
              {index < total - 1 && (
                <div className={`flex-1 mx-4 ${sizeClasses.connector} rounded transition-all duration-200 ${
                  index < current ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((current + 1) / total) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;