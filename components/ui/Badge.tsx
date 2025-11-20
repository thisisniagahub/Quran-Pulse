import React from 'react';
import { cn } from '../../lib/utils';

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'pro';
};

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'border-white/20 bg-primary/80 text-primary-foreground',
    secondary: 'border-white/20 bg-accent/80 text-black',
    destructive: 'border-white/20 bg-destructive/80 text-white',
    pro: 'border-white/20 bg-accent/80 text-black',
  };
  
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors backdrop-blur-sm';

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} {...props} />
  );
}

export { Badge };
