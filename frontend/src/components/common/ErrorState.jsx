import React from 'react';
import { cn, Button } from '../ui/Button';
import { MdErrorOutline } from 'react-icons/md';

const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'An error occurred while loading this content. Please try again.', 
  onRetry, 
  className 
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-xl border border-red-100', className)}>
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <MdErrorOutline className="text-4xl text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-1">{title}</h3>
      <p className="text-sm text-red-600 max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Retry
        </Button>
      )}
    </div>
  );
};

export { ErrorState };
