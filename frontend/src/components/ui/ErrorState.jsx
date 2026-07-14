import React from 'react';
import { MdErrorOutline, MdRefresh } from 'react-icons/md';
import { Button, cn } from './Button';

const ErrorState = ({ title = "Something went wrong", message = "An error occurred while loading this content.", onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
        <MdErrorOutline className="text-3xl text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <MdRefresh className="mr-2" /> Try Again
        </Button>
      )}
    </div>
  );
};

export { ErrorState };
