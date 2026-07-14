import React from 'react';
import { cn } from './Button';

const ProgressBar = ({ value, max = 100, className, color = 'bg-primary' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full bg-gray-100 rounded-full h-2.5 overflow-hidden', className)}>
      <div 
        className={cn('h-full rounded-full transition-all duration-300', color)} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export { ProgressBar };
