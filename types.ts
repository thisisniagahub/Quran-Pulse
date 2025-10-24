export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum ActiveView {
  QURAN_READER = 'quran-reader',
  PRAYER_TIMES = 'prayer-times',
  QIBLA = 'qibla',
  AI_COMPANION = 'ai-companion',
  TAJWEED_COACH = 'tajweed-coach',
  STUDY_PLANNER = 'study-planner',
  IBADAH_TRACKER = 'ibadah-tracker',
  DOA_ZIKR = 'doa-zikr',
  JAWI_WRITER = 'jawi-writer',
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
    sajda: boolean | { id: number; recommended: boolean; obligatory: boolean; };
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
  }
  imageUrl?: string;
  timestamp?: number;
}

export interface StudyPlanDay {
    day: number;
    topic: string;
    tasks: string[];
    estimated_time: string;
}

export interface StudyPlan {
    id?: number;
    plan_title: string;
    duration_days: number;
    daily_plan: StudyPlanDay[];
    goal: string;
    duration: string;
    level: string;
    timestamp?: number;
}

export interface PracticeMaterial {
    id?: number;
    title: string;
    content: string;
    type: 'iqra' | 'quran';
    timestamp?: number;
}

export interface AudioTrack {
    src: string;
    title: string;
    type: 'mp3' | 'wav_base64';
}

export interface AudioPlayerContextType {
    track: AudioTrack | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    error: string | null;
    playTrack: (track: AudioTrack) => void;
    togglePlayPause: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    skip: (seconds: number) => void;
    stop: () => void;
}

export interface JawiConversion {
    id?: number;
    rumi: string;
    jawi: string;
    timestamp?: number;
}

export interface TajweedSession {
    id?: number;
    material: PracticeMaterial;
    transcripts: { sender: 'user' | 'ai', text: string }[];
    timestamp?: number;
}
