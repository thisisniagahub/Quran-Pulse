import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariantsConfig = {
  base: 'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg',
      destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-lg',
      outline: 'border border-white/30 bg-white/10 hover:bg-white/20',
      secondary: 'bg-accent text-black hover:bg-yellow-400 dark:hover:bg-fuchsia-500 shadow-lg',
      ghost: 'hover:bg-white/20',
      link: 'text-primary underline-offset-4 hover:underline',
      accent: 'bg-accent text-black hover:bg-yellow-400 dark:hover:bg-fuchsia-500 shadow-lg',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-lg px-3',
      lg: 'h-11 rounded-xl px-8',
      icon: 'h-11 w-11',
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
