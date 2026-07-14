import React from 'react';
import { cn } from '../ui/Button';
import { MdOutlineInbox } from 'react-icons/md';

const EmptyState = ({ 
  title = 'No Data Found', 
  description = 'There is no data to display here yet.', 
  icon: Icon = MdOutlineInbox, 
  action, 
  className 
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-gray-300', className)}>
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Icon className="text-4xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export { EmptyState };
