import React from 'react';
import { ActiveView } from '../types';
import { BookOpenIcon, ClockIcon, CompassIcon, SparklesIcon, ListIcon } from './icons/Icons';
import { cn } from '../lib/utils';

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView, params?: any) => void;
}

const navItems = [
  { view: ActiveView.QURAN_READER, label: 'Al-Quran', icon: <BookOpenIcon /> },
  { view: ActiveView.PRAYER_TIMES, label: 'Solat', icon: <ClockIcon /> },
  { view: ActiveView.AI_COMPANION, label: 'Sobat AI', icon: <SparklesIcon /> },
  { view: ActiveView.QIBLA, label: 'Qiblat', icon: <CompassIcon /> },
  { view: ActiveView.DOA_ZIKR, label: 'Doa', icon: <ListIcon /> },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border md:hidden z-40">
      <div className="grid grid-cols-5 h-full">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
              activeView === item.view ? 'text-primary' : 'text-foreground/60 hover:text-primary'
            )}
          >
            <div className="w-6 h-6">{React.cloneElement(item.icon, { className: 'w-full h-full' })}</div>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
