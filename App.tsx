import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { AudioProvider } from './context/AudioContext';
import { SunIcon, MoonIcon, MenuIcon } from './components/icons/Icons';
import { ActiveView, Theme } from './types';
import { Button } from './components/ui/Button';

// P1 OPTIMIZATION: CODE SPLITTING
// Use React.lazy to dynamically import components. This splits the code into smaller chunks,
// so the user only downloads the code for the view they are currently on.
// This drastically reduces the initial bundle size and improves app load time.
const QuranReader = lazy(() => import('./components/QuranReader').then(module => ({ default: module.QuranReader })));
const PrayerTimes = lazy(() => import('./components/PrayerTimes').then(module => ({ default: module.PrayerTimes })));
const QiblaCompass = lazy(() => import('./components/QiblaCompass').then(module => ({ default: module.QiblaCompass })));
const AICompanion = lazy(() => import('./components/AICompanion').then(module => ({ default: module.AICompanion })));
const TajweedTutor = lazy(() => import('./components/TajweedTutor').then(module => ({ default: module.TajweedTutor })));
const StudyPlanner = lazy(() => import('./components/StudyPlanner').then(module => ({ default: module.StudyPlanner })));
const IbadahTracker = lazy(() => import('./components/IbadahTracker').then(module => ({ default: module.IbadahTracker })));
const DoaList = lazy(() => import('./components/DoaList').then(module => ({ default: module.DoaList })));
const JawiWriter = lazy(() => import('./components/JawiWriter').then(module => ({ default: module.JawiWriter })));
const LiveConversation = lazy(() => import('./components/LiveConversation').then(module => ({ default: module.LiveConversation })));
const TanyaUstaz = lazy(() => import('./components/TanyaUstaz').then(module => ({ default: module.TanyaUstaz })));
const AsmaulHusna = lazy(() => import('./components/AsmaulHusna').then(module => ({ default: module.AsmaulHusna })));
const InteractiveLesson = lazy(() => import('./components/InteractiveLesson'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const Achievements = lazy(() => import('./components/Achievements'));
const GemShop = lazy(() => import('./components/GemShop'));
const DailyGoals = lazy(() => import('./components/DailyGoals'));
const LearningPath = lazy(() => import('./components/LearningPath'));
const PlaceholderView = lazy(() => import('./components/PlaceholderView').then(module => ({ default: module.PlaceholderView })));


// A simple, reusable loading component to show while lazy-loaded components are being fetched.
const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-foreground-light/80 dark:text-foreground-dark/80">Memuatkan...</p>
        </div>
    </div>
);

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
        return <PlaceholderView title="Tafsir & Asbabun Nuzul" description="Terokai makna mendalam di sebalik setiap ayat Al-Quran dan fahami konteks penurunannya. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.KISAH_NABI:
        return <PlaceholderView title="Kisah 25 Nabi" description="Selami kisah-kisah inspirasi para nabi dan rasul sebagai teladan dalam kehidupan. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.PANDUAN_IBADAH:
        return <PlaceholderView title="Panduan Ibadah" description="Panduan langkah demi langkah untuk Wudhu dan Solat, lengkap dengan bacaan dan gambar rajah. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.TASBIH_DIGITAL:
        return <PlaceholderView title="Tasbih Digital" description="Alat mudah untuk membantu anda dalam berzikir harian di mana sahaja. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.SIRAH_NABAWIYAH:
        return <PlaceholderView title="Sirah Nabawiyah" description="Jelajahi perjalanan hidup Nabi Muhammad SAW, dari kelahiran hingga kewafatan baginda. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.HIJRI_CALENDAR:
        return <PlaceholderView title="Kalender Hijriyah" description="Kalender Islam yang lengkap dengan tarikh-tarikh penting dan hari kebesaran. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.ARTICLES:
        return <PlaceholderView title="Artikel Islami" description="Koleksi artikel dan renungan kontemporari mengenai pelbagai aspek kehidupan sebagai seorang Muslim. Ciri ini sedang dalam pembangunan." />;
      case ActiveView.HALAL_CHECKER:
        return <PlaceholderView title="Penyemak Kod Halal" description="Semak status halal produk makanan dengan mengimbas atau memasukkan E-kod. Ciri ini sedang dalam pembangunan." />;
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
        [ActiveView.TANYA_USTAZ]: "Tanya Ustaz",
        [ActiveView.TAJWEED_COACH]: "Tutor Tajwid AI",
        [ActiveView.STUDY_PLANNER]: "Pelan Pembelajaran AI",
        [ActiveView.IBADAH_TRACKER]: "Penjejak Ibadah",
        [ActiveView.DOA_ZIKR]: "Doa & Zikir Harian",
        [ActiveView.JAWI_WRITER]: "Penulis Jawi AI",
        [ActiveView.LIVE_CONVERSATION]: "Sembang Suara AI",
        [ActiveView.ASMAUL_HUSNA]: "Asmaul Husna",
        [ActiveView.INTERACTIVE_LESSON]: "Latihan Interaktif",
        [ActiveView.LEADERBOARD]: "Papan Markah",
        [ActiveView.ACHIEVEMENTS]: "Pencapaian",
        [ActiveView.GEM_SHOP]: "Kedai Permata",
        [ActiveView.DAILY_GOALS]: "Matlamat & Cabaran",
        [ActiveView.LEARNING_PATH]: "Laluan Pembelajaran",
        [ActiveView.TAFSIR]: "Tafsir & Asbabun Nuzul",
        [ActiveView.KISAH_NABI]: "Kisah 25 Nabi",
        [ActiveView.PANDUAN_IBADAH]: "Panduan Ibadah",
        [ActiveView.TASBIH_DIGITAL]: "Tasbih Digital",
        [ActiveView.SIRAH_NABAWIYAH]: "Sirah Nabawiyah",
        [ActiveView.HIJRI_CALENDAR]: "Kalender Hijriyah",
        [ActiveView.ARTICLES]: "Artikel Islami",
        [ActiveView.HALAL_CHECKER]: "Penyemak Kod Halal",
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
                <Button onClick={() => setSidebarOpen(!isSidebarOpen)} variant="ghost" size="icon" className="md:hidden text-foreground-light dark:text-foreground-dark">
                    <MenuIcon />
                </Button>
                <h1 className="text-xl font-bold text-primary md:hidden">{viewTitle}</h1>
              </div>
              <div className="flex-1 min-w-0 px-4">
                  <GlobalAudioPlayer />
              </div>
              <Button onClick={toggleTheme} variant="ghost" size="icon">
                {theme === Theme.LIGHT ? <MoonIcon /> : <SunIcon />}
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {/* 
              P1 OPTIMIZATION: SUSPENSE WRAPPER
              The <Suspense> component from React allows us to display a loading indicator (the 'fallback')
              while waiting for the lazy-loaded component to be downloaded and rendered.
            */}
            <Suspense fallback={<LoadingFallback />}>
              {renderActiveView()}
            </Suspense>
          </main>
        </div>
      </div>
    </AudioProvider>
  );
};

export default App;
