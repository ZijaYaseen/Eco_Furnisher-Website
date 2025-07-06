import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...', className = '' }) => (
  <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80 ${className}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
    <p className="mt-4 text-sm lg:text-base">{text}</p>
  </div>
);

export default LoadingSpinner; 