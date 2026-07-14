import React from 'react';
import { MdSearch } from 'react-icons/md';
import { cn } from '../ui/Button';

const SearchBar = ({ placeholder = 'Search...', value, onChange, className, ...props }) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <MdSearch className="absolute left-3 text-gray-400 text-lg" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors shadow-sm"
        {...props}
      />
    </div>
  );
};

export { SearchBar };
