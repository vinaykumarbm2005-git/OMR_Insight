import React from 'react';
import { cn } from './Button';

const Avatar = ({ src, alt, fallback, className, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden', sizes[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-gray-600">{fallback}</span>
      )}
    </div>
  );
};

export { Avatar };
