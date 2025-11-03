import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { BottomNavBar } from './components/BottomNavBar';
import { SunIcon, MoonIcon } from './components/icons/Icons';
import { ActiveView, Theme } from './types';
import { cn } from './lib/utils';
import { sidebarSections } from './components/Sidebar'; // Import for title lookup
import { OnboardingTutorial } from './components/OnboardingTutorial';

// --- Lazy-loaded Components ---
const QuranReader = lazy(() => import('./components/QuranReader').then(module => ({ default: module.QuranReader })));
const PrayerTimes = lazy(() => import('./components/PrayerTimes').then(module => ({ default: module.PrayerTimes })));
const QiblaCompass = lazy(() => import('./components/QiblaCompass').then(module => ({ default: module.QiblaCompass })));
const AICompanion = lazy(() => import('./components/AICompanion').then(module => ({ default: module.AICompanion })));
const TanyaUstaz = lazy(() => import('./components/TanyaUstaz').then(module => ({ default: module.TanyaUstaz })));
const TajweedTutor = lazy(() => import('./components/TajweedTutor').then(module => ({ default: module.TajweedTutor })));
const StudyPlanner = lazy(() => import('./components/StudyPlanner').then(module => ({ default: module.StudyPlanner })));
const IbadahTracker = lazy(() => import('./components/IbadahTracker').then(module => ({ default: module.IbadahTracker })));
const DoaList = lazy(() => import('./components/DoaList').then(module => ({ default: module.DoaList })));
const JawiWriter = lazy(() => import('./components/JawiWriter').then(module => ({ default: module.JawiWriter })));
const LiveConversation = lazy(() => import('./components/LiveConversation').then(module => ({ default: module.LiveConversation })));
const AsmaulHusna = lazy(() => import('./components/AsmaulHusna'));
const InteractiveLesson = lazy(() => import('./components/InteractiveLesson'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const Achievements = lazy(() => import('./components/Achievements'));
const GemShop = lazy(() => import('./components/GemShop'));
const DailyGoals = lazy(() => import('./components/DailyGoals'));
const LearningPath = lazy(() => import('./components/LearningPath'));
const TafsirView = lazy(() => import('./components/TafsirView').then(module => ({ default: module.TafsirView })));
const KisahNabiView = lazy(() => import('./components/KisahNabiView').then(module => ({ default: module.KisahNabiView })));
const PanduanIbadahView = lazy(() => import('./components/PanduanIbadahView').then(module => ({ default: module.PanduanIbadahView })));
const TasbihDigital = lazy(() => import('./components/TasbihDigital').then(module => ({ default: module.TasbihDigital })));
const SirahNabawiyahView = lazy(() => import('./components/SirahNabawiyahView').then(module => ({ default: module.SirahNabawiyahView })));
const HijriCalendarView = lazy(() => import('./components/HijriCalendarView').then(module => ({ default: module.HijriCalendarView })));
const ArtikelIslamiView = lazy(() => import('./components/ArtikelIslamiView').then(module => ({ default: module.ArtikelIslamiView })));
const HalalCheckerView = lazy(() => import('./components/HalalCheckerView').then(module => ({ default: module.HalalCheckerView })));
const ImageEditor = lazy(() => import('./components/ImageEditor').then(module => ({ default: module.ImageEditor })));
const PlaceholderView = lazy(() => import('./components/PlaceholderView').then(module => ({ default: module.PlaceholderView })));

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
);

function App() {
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.QURAN_READER);
  const [viewParams, setViewParams] = useState<any | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check for onboarding completion
    const hasCompletedTutorial = localStorage.getItem('hasCompletedAITutorial');
    if (!hasCompletedTutorial) {
      setShowOnboarding(true);
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === Theme.LIGHT || savedTheme === Theme.DARK)) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(Theme.DARK);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK);
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleCloseOnboarding = () => {
    localStorage.setItem('hasCompletedAITutorial', 'true');
    setShowOnboarding(false);
  };

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const handleSetActiveView = (view: ActiveView, params?: any) => {
    setActiveView(view);
    setViewParams(params || null);
  };
  
  const handleAutoplayHandled = () => {
    if(viewParams?.startAutoplay) {
      setViewParams((prev: any) => ({ ...prev, startAutoplay: false }));
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case ActiveView.QURAN_READER:
        return <QuranReader key={`${viewParams?.surah}-${viewParams?.ayah}`} initialSurah={viewParams?.surah} highlightAyah={viewParams?.ayah} startAutoplay={viewParams?.startAutoplay} onAutoplayHandled={handleAutoplayHandled} />;
      case ActiveView.PRAYER_TIMES:
        return <PrayerTimes />;
      case ActiveView.QIBLA:
        return <QiblaCompass />;
      case ActiveView.AI_COMPANION:
        return <AICompanion setActiveView={handleSetActiveView} />;
      case ActiveView.TANYA_USTAZ:
        return <TanyaUstaz />;
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
      case ActiveView.LIVE_CONVERSATION:
        return <LiveConversation />;
      case ActiveView.ASMAUL_HUSNA:
        return <AsmaulHusna />;
      case ActiveView.INTERACTIVE_LESSON:
        return <InteractiveLesson />;
      case ActiveView.LEADERBOARD:
        return <Leaderboard />;
      case ActiveView.ACHIEVEMENTS:
        return <Achievements />;
      case ActiveView.GEM_SHOP:
        return <GemShop />;
      case ActiveView.DAILY_GOALS:
        return <DailyGoals />;
      case ActiveView.LEARNING_PATH:
        return <LearningPath />;
      case ActiveView.TAFSIR:
        return <TafsirView />;
      case ActiveView.KISAH_NABI:
        return <KisahNabiView />;
      case ActiveView.PANDUAN_IBADAH:
        return <PanduanIbadahView />;
      case ActiveView.TASBIH_DIGITAL:
        return <TasbihDigital />;
      case ActiveView.SIRAH_NABAWIYAH:
        return <SirahNabawiyahView />;
      case ActiveView.HIJRI_CALENDAR:
        return <HijriCalendarView />;
      case ActiveView.ARTICLES:
        return <ArtikelIslamiView />;
      case ActiveView.HALAL_CHECKER:
        return <HalalCheckerView />;
      case ActiveView.IMAGE_EDITOR:
        return <ImageEditor />;
      default:
        return <PlaceholderView title={activeView} description="This feature is coming soon!" />;
    }
  };

  const getCurrentViewTitle = () => {
    for (const section of sidebarSections) {
      const item = section.items.find(item => item.view === activeView);
      if (item) return item.label;
    }
    return 'QuranPulse'; // Fallback title
  };

  return (
    <div className={cn("flex h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark font-sans", theme)}>
      {showOnboarding && <OnboardingTutorial onClose={handleCloseOnboarding} />}
      <Sidebar 
        activeView={activeView} 
        setActiveView={handleSetActiveView}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 h-16 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <h1 className="text-xl font-bold text-primary">{getCurrentViewTitle()}</h1>
          </div>
          <div className="flex-1">
             <GlobalAudioPlayer />
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
// FIX: Replaced string literal 'light' with Theme.LIGHT enum member for correct type comparison.
            {theme === Theme.LIGHT ? <MoonIcon /> : <SunIcon />}
          </button>
        </header>
        
        {/* Add padding-bottom to prevent content from being hidden by the bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <Suspense fallback={<LoadingSpinner />}>
            {renderActiveView()}
          </Suspense>
        </main>
      </div>
      
      {/* Mobile-only Bottom Navigation */}
      <BottomNavBar
        activeView={activeView}
        setActiveView={handleSetActiveView}
      />
    </div>
  );
}

export default App;