import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...', className = '' }) => (
  <div className={`min-h-[120px] flex flex-col items-center justify-center ${className}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
    <p className="mt-4 text-sm lg:text-base">{text}</p>
  </div>
);

export default LoadingSpinner; 