
import React from 'react';
import { ActiveView } from '../types';
import { 
    BookOpenIcon, ClockIcon, CompassIcon, SparklesIcon, MicrophoneIcon, 
    CalendarIcon, CheckSquareIcon, ListIcon, XIcon, ChatBubbleIcon, SpeakerWaveIcon, PencilIcon
} from './icons/Icons';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  view: ActiveView;
  activeView: ActiveView;
  onClick: (view: ActiveView) => void;
  isPremium?: boolean;
}> = ({ icon, label, view, activeView, onClick, isPremium = false }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      activeView === view
        ? 'bg-primary/10 text-primary'
        : 'text-foreground-light/80 dark:text-foreground-dark/80 hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
    {isPremium && (
      <span className="ml-auto text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
        PRO
      </span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setOpen }) => {
  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    if(window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setOpen(false)}></div>
      <aside className={`absolute md:relative flex flex-col w-64 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark h-full z-40 transform md:transform-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark h-[65px]">
          <h1 className="text-2xl font-bold text-primary">
            Quran<span className="font-normal text-foreground-light dark:text-foreground-dark">Pulse</span>
          </h1>
          <button onClick={() => setOpen(false)} className="md:hidden text-foreground-light dark:text-foreground-dark">
            <XIcon />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <p className="px-4 py-2 text-xs font-semibold text-foreground-light/60 dark:text-foreground-dark/60 uppercase tracking-wider">Ibadah</p>
          <NavItem icon={<BookOpenIcon />} label="Al-Quran" view={ActiveView.QURAN_READER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ClockIcon />} label="Waktu Solat" view={ActiveView.PRAYER_TIMES} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<CompassIcon />} label="Arah Qiblat" view={ActiveView.QIBLA} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<CheckSquareIcon />} label="Penjejak Ibadah" view={ActiveView.IBADAH_TRACKER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ListIcon />} label="Doa & Zikir" view={ActiveView.DOA_ZIKR} activeView={activeView} onClick={handleNavClick} />

          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-foreground-light/60 dark:text-foreground-dark/60 uppercase tracking-wider">Bantuan AI</p>
          <NavItem icon={<SparklesIcon />} label="Rujukan Ustaz AI" view={ActiveView.TANYA_USTAZ} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ChatBubbleIcon />} label="Sembang AI" view={ActiveView.AI_CHATBOT} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<SpeakerWaveIcon />} label="Sembang Suara AI" view={ActiveView.LIVE_CONVERSATION} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<PencilIcon />} label="Penulis Jawi AI" view={ActiveView.JAWI_WRITER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<MicrophoneIcon />} label="Tutor Tajwid AI" view={ActiveView.TAJWEED_COACH} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<CalendarIcon />} label="Pelan Pembelajaran" view={ActiveView.STUDY_PLANNER} activeView={activeView} onClick={handleNavClick} />
        </nav>
         <div className="p-4 mt-auto">
            <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg text-center">
                <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70">
                    Aplikasi ini adalah projek demo. <br /> Ciri AI adalah percuma untuk digunakan.
                </p>
            </div>
        </div>
      </aside>
    </>
  );
};