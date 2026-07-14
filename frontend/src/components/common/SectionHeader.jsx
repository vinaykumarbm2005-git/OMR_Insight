import React from 'react';
import { cn } from '../ui/Button';

const SectionHeader = ({ title, description, className, children }) => {
  return (
    <div className={cn('mb-4 pb-2 border-b border-border flex items-center justify-between', className)}>
      <div>
        <h2 className="text-lg font-medium text-text">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export { SectionHeader };
