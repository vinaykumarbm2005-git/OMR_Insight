import React from 'react';
import { cn } from './Button';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 checked:bg-primary checked:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
