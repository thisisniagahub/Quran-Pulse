import React from 'react';
import { 
  CrescentMoonIcon, 
  StarAndCrescentIcon, 
  MosqueIcon, 
  PrayerRugIcon, 
  MinaretIcon, 
  ArabicCalligraphyIcon, 
  IslamicStarIcon, 
  GeometricPatternIcon,
  QuranIcon,
  TasbihIcon
} from './icons/Icons';
import { cn } from '../lib/utils';

// Islamic-themed decorative elements
interface IslamicDecorationProps {
  variant?: 'crescent' | 'star' | 'mosque' | 'pattern' | 'quran' | 'tasbih';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IslamicDecoration: React.FC<IslamicDecorationProps> = ({ 
  variant = 'crescent', 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const iconMap = {
    crescent: CrescentMoonIcon,
    star: IslamicStarIcon,
    mosque: MosqueIcon,
    pattern: GeometricPatternIcon,
    quran: QuranIcon,
    tasbih: TasbihIcon
  };

  const IconComponent = iconMap[variant];
  
  return (
    <IconComponent 
      className={cn(
        sizeClasses[size],
        'text-primary',
        className
      )}
    />
  );
};

// Islamic-themed card backgrounds
interface IslamicCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'accent' | 'primary';
  className?: string;
}

export const IslamicCard: React.FC<IslamicCardProps> = ({ 
  children, 
  variant = 'light',
  className 
}) => {
  const variantClasses = {
    light: 'bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark',
    dark: 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark',
    accent: 'bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30',
    primary: 'bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20'
  };

  return (
    <div className={cn(
      'rounded-xl p-6 shadow-sm transition-all duration-300',
      variantClasses[variant],
      'islamic-subtle-geometry',
      className
    )}>
      {children}
    </div>
  );
};

// Islamic-themed progress bar
interface IslamicProgressBarProps {
  value: number;
  max?: number;
  variant?: 'green' | 'gold' | 'blue';
  label?: string;
  showPercentage?: boolean;
}

export const IslamicProgressBar: React.FC<IslamicProgressBarProps> = ({ 
  value, 
  max = 100, 
  variant = 'green',
  label,
  showPercentage = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantClasses = {
    green: 'bg-primary',
    gold: 'bg-secondary',
    blue: 'bg-accent'
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium text-foreground-light dark:text-foreground-dark">{label}</span>
          {showPercentage && (
            <span className="text-primary font-semibold">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Islamic-themed section header
interface IslamicSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const IslamicSectionHeader: React.FC<IslamicSectionHeaderProps> = ({ 
  title, 
  subtitle, 
  icon,
  className 
}) => {
  return (
    <div className={cn("text-center mb-8 relative", className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        {icon || <IslamicStarIcon className="w-8 h-8 text-primary" />}
      </div>
      <h2 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-foreground-light/70 dark:text-foreground-dark/70">
          {subtitle}
        </p>
      )}
      <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
};

// Islamic-themed achievement badge
interface IslamicBadgeProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'achievement' | 'completion' | 'milestone';
  className?: string;
}

export const IslamicBadge: React.FC<IslamicBadgeProps> = ({ 
  title, 
  description, 
  icon,
  variant = 'achievement',
  className 
}) => {
  const variantColors = {
    achievement: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    completion: 'bg-gradient-to-br from-green-400 to-green-600',
    milestone: 'bg-gradient-to-br from-blue-400 to-blue-600'
  };

  return (
    <div className={cn(
      "flex flex-col items-center p-4 rounded-xl text-white shadow-lg",
      variantColors[variant],
      className
    )}>
      <div className="mb-2">
        {icon || <StarAndCrescentIcon className="w-8 h-8" />}
      </div>
      <h3 className="font-bold text-center mb-1">{title}</h3>
      {description && (
        <p className="text-xs opacity-90 text-center">{description}</p>
      )}
    </div>
  );
};

// Islamic-themed loading spinner
export const IslamicSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-12 h-12">
        <CrescentMoonIcon className="w-8 h-8 text-primary animate-spin mx-auto" />
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
      </div>
    </div>
  );
};

export const IslamicSeparator = () => {
  return (
    <div className="flex items-center my-6">
      <div className="flex-grow border-t border-border-light dark:border-border-dark"></div>
      <IslamicStarIcon className="w-4 h-4 text-primary mx-3" />
      <div className="flex-grow border-t border-border-light dark:border-border-dark"></div>
    </div>
  );
};