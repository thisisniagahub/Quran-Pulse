
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { QuranReader } from './components/QuranReader';
import { PrayerTimes } from './components/PrayerTimes';
import { QiblaCompass } from './components/QiblaCompass';
import { AICompanion } from './components/AICompanion';
import { TajweedTutor } from './components/TajweedTutor';
import { StudyPlanner } from './components/StudyPlanner';
import { IbadahTracker } from './components/IbadahTracker';
import { DoaList } from './components/DoaList';
import { JawiWriter } from './components/JawiWriter';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { AudioProvider } from './context/AudioContext';
import { SunIcon, MoonIcon, MenuIcon } from './components/icons/Icons';
import { ActiveView, Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.QURAN_READER);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [quranSurah, setQuranSurah] = useState(1);
  const [quranAyah, setQuranAyah] = useState<number | null>(null);
  const [quranAutoplay, setQuranAutoplay] = useState(false);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const handleNavigation = (view: ActiveView, params?: { surahNumber?: number; ayahNumber?: number; autoplay?: boolean }) => {
    // Reset autoplay trigger on any navigation. It will be set again if needed.
    if (quranAutoplay) {
        setQuranAutoplay(false);
    }

    if (view === ActiveView.QURAN_READER && params?.surahNumber) {
        setQuranSurah(params.surahNumber);
        setQuranAyah(params.ayahNumber ?? null);
        if (params.autoplay) {
            setQuranAutoplay(true);
        }
    }
    setActiveView(view);
    // Close sidebar on navigation for mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };


  const renderActiveView = () => {
    switch (activeView) {
      case ActiveView.QURAN_READER:
        return <QuranReader 
          key={`${quranSurah}-${quranAyah}`} 
          initialSurah={quranSurah} 
          highlightAyah={quranAyah} 
          startAutoplay={quranAutoplay}
          onAutoplayHandled={() => setQuranAutoplay(false)}
        />;
      case ActiveView.PRAYER_TIMES:
        return <PrayerTimes />;
      case ActiveView.QIBLA:
        return <QiblaCompass />;
      case ActiveView.AI_COMPANION:
        return <AICompanion onNavigate={handleNavigation} />;
      case ActiveView.TAJWEED_COACH:
        return <TajweedTutor />;
      case ActiveView.STUDY_PLANNER:
        return <StudyPlanner />;
      case ActiveView.IBADAH_TRACKER:
        return <IbadahTracker />;
      case ActiveView.DOA_ZIKR:
          return <DoaList />;
      case ActiveView.JAWI_WRITER:
          return <JawiWriter />;
      default:
        return <QuranReader initialSurah={1} />;
    }
  };

  const viewTitle = useMemo(() => {
    const titles: { [key in ActiveView]: string } = {
        [ActiveView.QURAN_READER]: "Al-Quran Al-Karim",
        [ActiveView.PRAYER_TIMES]: "Waktu Solat",
        [ActiveView.QIBLA]: "Arah Qiblat",
        [ActiveView.AI_COMPANION]: "Sobat AI Cerdas",
        [ActiveView.TAJWEED_COACH]: "Tutor Tajwid AI",
        [ActiveView.STUDY_PLANNER]: "Pelan Pembelajaran AI",
        [ActiveView.IBADAH_TRACKER]: "Penjejak Ibadah",
        [ActiveView.DOA_ZIKR]: "Doa & Zikir Harian",
        [ActiveView.JAWI_WRITER]: "Penulis Jawi AI",
    };
    return titles[activeView];
  }, [activeView]);

  return (
    <AudioProvider>
      <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans text-foreground-light dark:text-foreground-dark">
        <Sidebar activeView={activeView} setActiveView={handleNavigation} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex-shrink-0 p-4 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark z-20">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden text-foreground-light dark:text-foreground-dark">
                    <MenuIcon />
                </button>
                <h1 className="text-xl font-bold text-primary md:hidden">{viewTitle}</h1>
              </div>
              <div className="flex-1 min-w-0 px-4">
                  <GlobalAudioPlayer />
              </div>
              <button onClick={toggleTheme} className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                {theme === Theme.LIGHT ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </AudioProvider>
  );
};

export default App;
