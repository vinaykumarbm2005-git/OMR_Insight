import React from 'react';
import { cn } from '../ui/Button';

const PageHeader = ({ title, description, actions, className }) => {
  return (
    <div className={cn('flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0', className)}>
      <div>
        <h1 className="text-2xl font-semibold text-text tracking-tight">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export { PageHeader };
