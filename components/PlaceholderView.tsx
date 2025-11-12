import React from 'react';
import { WrenchScrewdriverIcon } from './icons/Icons';

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-foreground-light/70 dark:text-foreground-dark/70 p-8">
      <div className="mb-6 text-primary">
        {icon || <WrenchScrewdriverIcon className="w-20 h-20" />}
      </div>
      <h2 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark mb-3">{title}</h2>
      <p className="max-w-md text-lg">{description}</p>
        <div className="mt-8 bg-primary/10 text-primary text-sm px-4 py-3 rounded-lg">
            Nantikan kemas kini kami yang akan datang!
        </div>
    </div>
  );
};

// FIX: Add a default export to solve lazy loading type inference issues.
export default PlaceholderView;
