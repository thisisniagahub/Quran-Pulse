import React from 'react';
import { cn } from '../../lib/utils';

// This is a simplified version of class-variance-authority (cva)
// to avoid adding new dependencies, fulfilling the project constraints.
const buttonVariantsConfig = {
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-white hover:bg-primary/90',
      destructive: 'bg-red-500 text-white hover:bg-red-500/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-primary/10 text-primary hover:bg-primary/20',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      accent: 'bg-accent text-background-dark hover:bg-accent/90'
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariantsConfig.variants.variant;
  size?: keyof typeof buttonVariantsConfig.variants.size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariantsConfig.base,
          buttonVariantsConfig.variants.variant[variant],
          buttonVariantsConfig.variants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
