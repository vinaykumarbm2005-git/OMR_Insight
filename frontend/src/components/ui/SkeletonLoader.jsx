import React from 'react';
import { cn } from './Button';

const SkeletonLoader = ({ className, type = 'rect', ...props }) => {
  const baseClass = "animate-pulse bg-gray-200";
  
  if (type === 'circle') {
    return <div className={cn(baseClass, "rounded-full", className)} {...props} />;
  }
  
  if (type === 'text') {
    return <div className={cn(baseClass, "h-4 rounded", className)} {...props} />;
  }
  
  return <div className={cn(baseClass, "rounded-md", className)} {...props} />;
};

export { SkeletonLoader };
