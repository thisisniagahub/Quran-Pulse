import React from 'react';
import {
  BookOpenIcon, ClockIcon, CompassIcon, SparklesIcon, MicrophoneIcon,
  CalendarIcon, PencilIcon, ChatBubbleIcon, StarIcon, ListIcon,
  CheckSquareIcon, UsersIcon, TrophyIcon, ShoppingCartIcon, TargetIcon,
  TrendingUpIcon, BookMarkedIcon, NewspaperIcon, RepeatIcon, ShieldCheckIcon,
  CalendarDaysIcon, WrenchScrewdriverIcon, XIcon, PaletteIcon
} from './icons/Icons';
import { ActiveView } from '../types';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';

// Interface for props
interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView, params?: any) => void;
}

// Data structure for sidebar items - EXPORTED to be used in App.tsx for titles
export const sidebarSections = [
  {
    title: 'Utama',
    items: [
      { view: ActiveView.QURAN_READER, label: 'Al-Quran', icon: <BookOpenIcon className="w-5 h-5" /> },
      { view: ActiveView.PRAYER_TIMES, label: 'Waktu Solat', icon: <ClockIcon className="w-5 h-5" /> },
      { view: ActiveView.QIBLA, label: 'Arah Qiblat', icon: <CompassIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Alat AI (PRO)',
    items: [
      { view: ActiveView.AI_COMPANION, label: 'Sobat AI Cerdas', icon: <SparklesIcon className="w-5 h-5" /> },
      { view: ActiveView.TANYA_USTAZ, label: 'Tanya Ustaz', icon: <ChatBubbleIcon className="w-5 h-5" /> },
      { view: ActiveView.TAJWEED_COACH, label: 'Tutor Tajwid', icon: <MicrophoneIcon className="w-5 h-5" /> },
      { view: ActiveView.STUDY_PLANNER, label: 'Pelan Belajar', icon: <CalendarIcon className="w-5 h-5" /> },
      { view: ActiveView.JAWI_WRITER, label: 'Penulis Jawi', icon: <PencilIcon className="w-5 h-5" /> },
      { view: ActiveView.LIVE_CONVERSATION, label: 'Sembang Suara', icon: <ChatBubbleIcon className="w-5 h-5" /> },
      { view: ActiveView.IMAGE_EDITOR, label: 'Editor Imej AI', icon: <PaletteIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Amalan & Pembelajaran',
    items: [
        { view: ActiveView.ASMAUL_HUSNA, label: 'Asmaul Husna', icon: <StarIcon className="w-5 h-5" /> },
        { view: ActiveView.INTERACTIVE_LESSON, label: 'Latihan Interaktif', icon: <WrenchScrewdriverIcon className="w-5 h-5" /> },
        { view: ActiveView.DOA_ZIKR, label: 'Doa & Zikir', icon: <ListIcon className="w-5 h-5" /> },
        { view: ActiveView.IBADAH_TRACKER, label: 'Penjejak Ibadah', icon: <CheckSquareIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Gamifikasi',
    items: [
        { view: ActiveView.LEADERBOARD, label: 'Papan Markah', icon: <UsersIcon className="w-5 h-5" /> },
        { view: ActiveView.ACHIEVEMENTS, label: 'Pencapaian', icon: <TrophyIcon className="w-5 h-5" /> },
        { view: ActiveView.GEM_SHOP, label: 'Kedai Permata', icon: <ShoppingCartIcon className="w-5 h-5" /> },
        { view: ActiveView.DAILY_GOALS, label: 'Matlamat Harian', icon: <TargetIcon className="w-5 h-5" /> },
        { view: ActiveView.LEARNING_PATH, label: 'Laluan Pembelajaran', icon: <TrendingUpIcon className="w-5 h-5" /> },
    ]
  },
  {
    title: 'Kandungan Tambahan',
    items: [
        { view: ActiveView.TAFSIR, label: 'Tafsir', icon: <BookMarkedIcon className="w-5 h-5" /> },
        { view: ActiveView.KISAH_NABI, label: 'Kisah Nabi', icon: <BookMarkedIcon className="w-5 h-5" /> },
        { view: ActiveView.PANDUAN_IBADAH, label: 'Panduan Ibadah', icon: <BookOpenIcon className="w-5 h-5" /> },
        { view: ActiveView.TASBIH_DIGITAL, label: 'Tasbih Digital', icon: <RepeatIcon className="w-5 h-5" /> },
        { view: ActiveView.SIRAH_NABAWIYAH, label: 'Sirah Nabawiyah', icon: <BookMarkedIcon className="w-5 h-5" /> },
        { view: ActiveView.HIJRI_CALENDAR, label: 'Kalendar Hijriyah', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { view: ActiveView.ARTICLES, label: 'Artikel Islami', icon: <NewspaperIcon className="w-5 h-5" /> },
        { view: ActiveView.HALAL_CHECKER, label: 'Penyemak Halal', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    ]
  }
];

const NavItem: React.FC<{
  view: ActiveView;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isPro?: boolean;
}> = ({ view, label, icon, isActive, onClick, isPro }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "flex items-center p-2 rounded-lg transition-colors duration-200",
        isActive
          ? "bg-primary text-white font-semibold shadow-sm"
          : "text-foreground-light/80 dark:text-foreground-dark/80 hover:bg-primary/10"
      )}
    >
      {icon}
      <span className="ml-3">{label}</span>
      {isPro && <Badge variant="pro" className="ml-auto">PRO</Badge>}
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside
        className={cn(
          "hidden md:flex w-64 bg-card-light dark:bg-card-dark flex-shrink-0 flex-col transition-transform duration-300 ease-in-out z-40"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
          <h1 className="text-2xl font-bold text-primary">QuranPulse</h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarSections.map((section, index) => (
              <React.Fragment key={index}>
                <h2 className="px-2 pt-4 pb-2 text-xs font-semibold uppercase text-foreground-light/60 dark:text-foreground-dark/60">
                  {section.title}
                </h2>
                {section.items.map(item => (
                  <NavItem
                    key={item.view}
                    view={item.view}
                    label={item.label}
                    icon={item.icon}
                    isActive={activeView === item.view}
                    onClick={() => setActiveView(item.view)}
                    isPro={section.title.includes('PRO')}
                  />
                ))}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </aside>
  );
};