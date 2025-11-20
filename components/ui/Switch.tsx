import React from 'react';
import { cn } from '../../lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => (
    <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        className="sr-only peer"
        onChange={(e) => onCheckedChange(e.currentTarget.checked)}
        {...props}
      />
      <div className="w-14 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full peer peer-checked:bg-primary transition-colors">
        <div className={cn("w-6 h-6 bg-white rounded-full transition-transform m-1 shadow-md",
          checked ? "translate-x-6" : "translate-x-0"
        )}></div>
      </div>
    </label>
  )
);
Switch.displayName = 'Switch';

export { Switch };
