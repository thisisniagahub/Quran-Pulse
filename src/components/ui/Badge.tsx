import React from 'react';
import { cn } from '../../lib/utils';

// This resolves a TypeScript issue where `className` and other HTML attributes
// were not being correctly inherited from React.HTMLAttributes.
type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'pro';
};

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'border-transparent bg-primary text-white',
    secondary: 'border-transparent bg-primary/10 text-primary',
    destructive: 'border-transparent bg-red-500 text-white',
    pro: 'border-transparent bg-accent text-background-dark',
  };
  
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} {...props} />
  );
}

export { Badge };