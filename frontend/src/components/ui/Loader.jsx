import React from 'react';
import { cn } from './Button';
import { BiLoaderAlt } from 'react-icons/bi';

const Loader = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={cn('flex items-center justify-center p-4', className)} {...props}>
      <BiLoaderAlt className={cn('animate-spin text-primary', sizes[size])} />
    </div>
  );
};

export { Loader };
