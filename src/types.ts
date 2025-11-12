import React from 'react';

// --- General App State ---

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
  IMAGE_EDITOR = 'image-editor',
  DAILY_QUOTE = 'daily-quote',
}

// --- Quran Data ---

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
  sajda: boolean | {
    id: number;
    recommended: boolean;
    obligatory: boolean;
  };
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
  translations: {
    malay: Translation[];
    sahih: Translation[];
    transliteration: Translation[];
  };
}

// --- Prayer Times ---

export interface PrayerTimesData {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

// --- AI & Chat ---

export interface ChatMessage {
  id?: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: number;
}

export interface StudyPlan {
  id?: number;
  goal: string;
  duration: string;
  level: string;
  plan_title: string;
  duration_days: number;
  daily_plan: {
    day: number;
    topic: string;
    tasks: string[];
    estimated_time: string;
  }[];
  timestamp?: number;
}

export interface JawiConversion {
  id?: number;
  rumi: string;
  jawi: string;
  timestamp?: number;
}

// --- Tajweed & Iqra ---

export interface PracticeMaterial {
  title: string;
  content: string;
  type: 'quran' | 'iqra';
}

export interface TajweedSession {
  id?: number;
  material: PracticeMaterial;
  transcripts: ChatMessage[];
  accuracy: number;
  timestamp?: number;
}

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

export interface IqraPage {
    book: number;
    page: number;
    title: string;
    description?: string;
    lines: string[];
}

export interface IqraPracticeSession {
  id?: number;
  book: number;
  page: number;
  score: number;
  stars: number;
  timestamp?: number;
}

// --- Audio Player ---

export interface AudioTrack {
  src: string;
  title: string;
  type: 'mp3' | 'wav_base64';
}

export interface AudioContextType {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  playbackRate: number;
  playTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  retry: () => void;
  dismissError: () => void;
  setPlaybackRate: (rate: number) => void;
}

// --- Static Content Types ---

export interface ContentStory {
  id: string;
  title: string;
  summary: string;
  content: string; 
  videoId?: string;
  image: string;
  quranicReference?: {
    text: string;
    surah: string;
  };
}

export interface Guide {
  id: string;
  title: string;
  summary: string;
  steps: {
    title: string;
    description: string;
  }[];
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
}
