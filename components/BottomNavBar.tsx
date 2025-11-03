import React, { useState } from 'react';
import { ActiveView } from '../types';
import { cn } from '../lib/utils';
import { BookOpenIcon, ClockIcon, SparklesIcon, DotsHorizontalIcon, XIcon } from './icons/Icons';
import { sidebarSections } from './Sidebar';

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView, params?: any) => void;
}

interface NavItem {
  view: ActiveView;
  label: string;
  // FIX: Explicitly type the ReactElement generic to `any` to avoid type inference issues
  // with React.cloneElement in some TypeScript configurations. This resolves the overload error.
  icon: React.ReactElement<any>;
}

const mainNavItems: NavItem[] = [
  { view: ActiveView.QURAN_READER, label: 'Al-Quran', icon: <BookOpenIcon /> },
  { view: ActiveView.PRAYER_TIMES, label: 'Waktu Solat', icon: <ClockIcon /> },
  { view: ActiveView.AI_COMPANION, label: 'Sobat AI', icon: <SparklesIcon /> },
];

const MoreMenu: React.FC<{ setActiveView: (view: ActiveView) => void; onClose: () => void }> = ({ setActiveView, onClose }) => {
  const handleSelect = (view: ActiveView) => {
    setActiveView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="bg-card-light dark:bg-card-dark rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Semua Ciri</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"><XIcon /></button>
        </div>
        <div className="space-y-2">
          {sidebarSections.map(section => (
            <div key={section.title}>
              <h3 className="px-2 pt-3 pb-1 text-sm font-semibold text-foreground-light/60 dark:text-foreground-dark/60">{section.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {section.items.map(item => (
                  <button
                    key={item.view}
                    onClick={() => handleSelect(item.view)}
                    className="flex items-center gap-3 p-3 rounded-lg text-left hover:bg-primary/10 transition-colors"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card-light/95 dark:bg-card-dark/95 backdrop-blur-sm border-t border-border-light dark:border-border-dark z-50">
        <div className="flex justify-around items-center h-full">
          {mainNavItems.map(item => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                activeView === item.view ? 'text-primary' : 'text-foreground-light/70 dark:text-foreground-dark/70'
              )}
            >
              {/* FIX: Removed unnecessary type assertion as the type of `item.icon` is now more specific. */}
              {React.cloneElement(item.icon, { className: "w-6 h-6" })}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 w-full h-full text-foreground-light/70 dark:text-foreground-dark/70"
          >
            <DotsHorizontalIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Lainnya</span>
          </button>
        </div>
      </div>
      {isMoreMenuOpen && <MoreMenu setActiveView={setActiveView} onClose={() => setMoreMenuOpen(false)} />}
    </>
  );
};
