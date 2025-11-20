import React from 'react';
import { cn } from '../../lib/utils';
import { HistoryIcon } from '../icons/Icons';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode; // For CTA buttons
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 bg-background rounded-lg border-2 border-dashed border-border',
        className
      )}
    >
      <div className="mb-4 text-primary/50">
        {icon || <HistoryIcon className="w-16 h-16" />}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-foreground/70">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};