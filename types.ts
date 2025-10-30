// P3 FIX: Re-added error handling properties to the context type.
export interface AudioContextType {
    track: AudioTrack | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    error: string | null; // <-- RE-ADDED
    playTrack: (track: AudioTrack) => void;
    togglePlayPause: () => void;
    stop: () => void;
    seek: (time: number) => void;
    retry: () => void; // <-- RE-ADDED
    dismissError: () => void; // <-- RE-ADDED
}

export interface AudioTrack {
    src: string; // URL or base64 data for WAV
    title: string;
    type: 'mp3' | 'wav_base64';
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum ActiveView {
  QURAN_READER = 'quran-reader',
  PRAYER_TIMES = 'prayer-times',
  QIBLA = 'qibla',
  AI_COMPANION = 'ai-companion',
  TANYA_USTAZ = 'tanya-ustaz',
  TAJWEED_COACH = 'tajweed-coach',
  STUDY_PLANNER = 'study-planner',
  IBADAH_TRACKER = 'ibadah-tracker',
  DOA_ZIKR = 'doa-zikr',
  JAWI_WRITER = 'jawi-writer',
  LIVE_CONVERSATION = 'live-conversation',
  ASMAUL_HUSNA = 'asmaul-husna',
  INTERACTIVE_LESSON = 'interactive-lesson',
  LEADERBOARD = 'leaderboard',
  ACHIEVEMENTS = 'achievements',
  GEM_SHOP = 'gem-shop',
  DAILY_GOALS = 'daily-goals',
  LEARNING_PATH = 'learning-path',
  TAFSIR = 'tafsir',
  KISAH_NABI = 'kisah-nabi',
  PANDUAN_IBADAH = 'panduan-ibadah',
  TASBIH_DIGITAL = 'tasbih-digital',
  SIRAH_NABAWIYAH = 'sirah-nabawiyah',
  HIJRI_CALENDAR = 'hijri-calendar',
  ARTICLES = 'articles',
  HALAL_CHECKER = 'halal-checker',
}

export interface IqraPage {
  book: number;
  page: number;
  lines: string[];
  title?: string;
  description?: string;
  category?: 'cover' | 'intro' | 'lesson' | 'exercise' | 'review';
}

export interface Translation {
  text: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
  translations: {
    malay: Translation[];
    sahih: Translation[];
    transliteration: Translation[];
  };
}

export interface PrayerTimesData {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface ChatMessage {
  id?: number;
  sender: 'user' | 'ai';
  text: string;
  citation?: string;
  action?: {
    label: string;
    view: ActiveView;
    params?: { [key: string]: any };
  };
  imageUrl?: string;
  groundingSources?: any[];
  timestamp?: number;
}

export interface StudyPlan {
    id?: number;
    plan_title: string;
    duration_days: number;
    daily_plan: {
        day: number;
        topic: string;
        tasks: string[];
        estimated_time: string;
    }[];
    goal?: string;
    duration?: string;
    level?: string;
    timestamp?: number;
}

export interface JawiConversion {
    id?: number;
    rumi: string;
    jawi: string;
    timestamp?: number;
}

// FIX: Add and export TajweedRule interface
export interface TajweedRule {
  id: string;
  name: string;
  arabic: string;
  description: string;
  howToRead: string;
  examples: {
    arabic: string;
    transliteration: string;
    explanation: string;
  }[];
}

export interface PracticeMaterial {
    title: string;
    content: string;
    type: 'iqra' | 'quran';
}

export interface TajweedSession {
    id?: number;
    material: PracticeMaterial;
    transcripts: { sender: 'user' | 'ai', text: string }[];
    accuracy?: number;
    timestamp?: number;
}
