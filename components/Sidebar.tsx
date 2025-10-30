
import React from 'react';
import { ActiveView } from '../types';
import { 
    BookOpenIcon, ClockIcon, CompassIcon, SparklesIcon, MicrophoneIcon, 
    CalendarIcon, CheckSquareIcon, ListIcon, XIcon, PencilIcon, ChatBubbleIcon,
    StarIcon, UsersIcon, BookMarkedIcon, WrenchScrewdriverIcon, NewspaperIcon,
    RepeatIcon, ShieldCheckIcon, CalendarDaysIcon, TrophyIcon, AwardIcon, ShoppingCartIcon, TargetIcon,
    TrendingUpIcon
} from './icons/Icons';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView, params?: any) => void;
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
  <Button
    variant={activeView === view ? 'secondary' : 'ghost'}
    onClick={() => onClick(view)}
    className="w-full justify-start px-4 py-3 text-sm font-medium"
  >
    {icon}
    <span className="ml-3">{label}</span>
    {isPremium && (
      <Badge variant="pro" className="ml-auto">
        PRO
      </Badge>
    )}
  </Button>
);

const NavHeader: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <p className="px-4 pt-6 pb-2 text-xs font-semibold text-foreground-light/60 dark:text-foreground-dark/60 uppercase tracking-wider">{children}</p>
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
          <Button onClick={() => setOpen(false)} variant="ghost" size="icon" className="md:hidden">
            <XIcon />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavHeader>Ibadah Harian</NavHeader>
          <NavItem icon={<BookOpenIcon />} label="Al-Quran" view={ActiveView.QURAN_READER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ClockIcon />} label="Waktu Solat" view={ActiveView.PRAYER_TIMES} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<CompassIcon />} label="Arah Qiblat" view={ActiveView.QIBLA} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<CheckSquareIcon />} label="Penjejak Ibadah" view={ActiveView.IBADAH_TRACKER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ListIcon />} label="Doa & Zikir" view={ActiveView.DOA_ZIKR} activeView={activeView} onClick={handleNavClick} />

          <NavHeader>Pembelajaran AI</NavHeader>
          <NavItem icon={<SparklesIcon />} label="Sobat AI Cerdas" view={ActiveView.AI_COMPANION} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<SparklesIcon />} label="Tanya Ustaz" view={ActiveView.TANYA_USTAZ} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<MicrophoneIcon />} label="Tutor Tajwid AI" view={ActiveView.TAJWEED_COACH} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<CalendarIcon />} label="Pelan Pembelajaran" view={ActiveView.STUDY_PLANNER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ChatBubbleIcon />} label="Sembang Suara AI" view={ActiveView.LIVE_CONVERSATION} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<TrendingUpIcon />} label="Laluan Pembelajaran" view={ActiveView.LEARNING_PATH} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<TrophyIcon />} label="Latihan Interaktif" view={ActiveView.INTERACTIVE_LESSON} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<TargetIcon />} label="Matlamat Harian" view={ActiveView.DAILY_GOALS} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<AwardIcon />} label="Papan Markah" view={ActiveView.LEADERBOARD} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<TrophyIcon />} label="Pencapaian" view={ActiveView.ACHIEVEMENTS} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          <NavItem icon={<ShoppingCartIcon />} label="Kedai Permata" view={ActiveView.GEM_SHOP} activeView={activeView} onClick={handleNavClick} isPremium={true} />
          
          <NavHeader>Ilmu & Rujukan</NavHeader>
          <NavItem icon={<StarIcon />} label="Asmaul Husna" view={ActiveView.ASMAUL_HUSNA} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<UsersIcon />} label="Kisah 25 Nabi" view={ActiveView.KISAH_NABI} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<BookMarkedIcon />} label="Sirah Nabawiyah" view={ActiveView.SIRAH_NABAWIYAH} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<BookOpenIcon />} label="Tafsir & Asbabun Nuzul" view={ActiveView.TAFSIR} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<WrenchScrewdriverIcon />} label="Panduan Ibadah" view={ActiveView.PANDUAN_IBADAH} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<NewspaperIcon />} label="Artikel Islami" view={ActiveView.ARTICLES} activeView={activeView} onClick={handleNavClick} />

          <NavHeader>Alatan</NavHeader>
          <NavItem icon={<CalendarDaysIcon />} label="Kalender Hijriyah" view={ActiveView.HIJRI_CALENDAR} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<RepeatIcon />} label="Tasbih Digital" view={ActiveView.TASBIH_DIGITAL} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<PencilIcon />} label="Penulis Jawi AI" view={ActiveView.JAWI_WRITER} activeView={activeView} onClick={handleNavClick} />
          <NavItem icon={<ShieldCheckIcon />} label="Penyemak Kod Halal" view={ActiveView.HALAL_CHECKER} activeView={activeView} onClick={handleNavClick} />
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
