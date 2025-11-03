# QuranPulse - Comprehensive Project Context

## Project Overview

QuranPulse is a sophisticated and trustworthy Al-Quran SuperApp specifically designed for the Muslim community in Malaysia. The application combines essential daily worship tools with advanced AI-powered learning features and comprehensive gamification systems for motivation, all presented in a mobile-first, ethical, and user-friendly interface.

The application is built with performance as a priority, using modern techniques like code splitting, lazy loading, and cache-first strategies to ensure fast and responsive experiences, even in offline conditions.

### Key Features

#### Core Islamic Tools
- **Quran Reader:** Read the Quran with clear Uthmani script with **Audio Murattal** from famous reciters (Mishary Rashid Alafasy) and autoplay features
- **Multi-language Translation:** Malay translation (Tafsir Pimpinan Ar-Rahman), English (Sahih International), and Rumi transliteration
- **Prayer Times & Qibla:** Get accurate prayer times for all of Malaysia and find Qibla direction with an integrated compass
- **Worship Tracker & Daily Prayers:** Track daily practices and access collections of daily prayers and remembrance
- **Rich Islamic Content:** Explore Asmaul Husna, Tafsir, Stories of Prophets, Worship Guides, Digital Tasbih, Sirah Nabawiyah, Hijri Calendar, Islamic Articles, and Halal Checker

#### AI-Powered Learning Tools (PRO)
- **Smart AI Companion:** A versatile AI agent that can navigate the app, answer questions, and generate images to aid learning
- **Ask Ustaz:** Formal Q&A mode that answers jurisprudence questions exclusively from authoritative Malaysian sources
- **AI Tajweed Tutor:** Get real-time feedback on Quran reading or Iqra' using AI audio analysis
- **AI Learning Plans:** Generate personalized learning or memorization schedules based on your goals
- **AI Voice Chat:** Interactive voice conversation sessions with AI in Malay for practice
- **AI Jawi Writer:** Instantly convert Rumi text to Jawi script
- **Verse Explanations:** Get simple, easy-to-understand explanations for any Quran verse with a single click

#### Gamification & Motivation
- **Learning Paths:** Follow structured curricula from basic Iqra' to advanced tajweed and surah memorization in interactive maps
- **Daily Goals:** Set daily XP targets and complete specific goals to earn rewards
- **Weekly & Monthly Challenges:** Join long-term challenges like "Weekly Marathon" or "Memorize Juz 30" for bigger prizes
- **Leaderboard:** Compete with friends, local (Malaysia), and global users. Rise or fall in leagues based on weekly performance
- **Achievements & Badges:** Unlock dozens of unique badges by completing various tasks across categories
- **Gem Shop:** Use earned gems to purchase in-game items like power-ups, cosmetic items, or premium access
- **In-App Purchases (Simulation):** Experience the purchase flow for gem packages through an interactive payment modal

## Technology Stack

### Frontend
- **Framework:** React 18 (using Vite build tool)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom configuration
- **Design:** Mobile-First Responsive Design with bottom navigation for mobile and sidebar for desktop
- **State Management:** React Context API & Hooks (useState, useEffect, useContext)
- **Icons:** Custom SVG components in `components/icons/Icons.tsx`

### Backend (Proxy Server)
- **Framework:** Express.js
- **Purpose:** Securely manage API keys, handle requests to Gemini API, and provide endpoints for application logic like purchase simulation

### Artificial Intelligence (AI)
- **Provider:** Google Gemini API (`@google/genai`)
- **Models Used:** `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-image`, `gemini-2.5-flash-native-audio-preview-09-2025` (Live API), `gemini-2.5-flash-preview-tts`

### APIs & Data Sources
- **Quran Text & Translations:** `api.alquran.cloud`
- **Audio Recitation:** `everyayah.com`
- **Prayer Times:** `api.aladhan.com` (as proxy for e-Solat JAKIM data)
- **Static Data:** Iqra', Asmaul Husna, and Surah lists stored locally for optimal performance

### Storage & Browser APIs
- **IndexedDB:** For application data caching (chats, learning plans, tajweed sessions, verse explanations)
- **Local Storage:** For simple progress tracking like worship tracking and zikir counts
- **Geolocation API:** For Qibla & Prayer Times
- **Media Devices API (Microphone):** For interactive audio features
- **Web Audio API:** For audio processing and playback

## Project Structure

```
quranpulse/
├── public/
│   └── data/
│       └── iqraData.json      # Static Iqra data (optimized)
├── server/
│   └── src/
│       ├── routes/
│       │   └── api.ts         # Route handlers for Gemini proxy
│       └── index.ts           # Express server entry point
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components (Button, Card)
│   │   ├── icons/               # SVG icon components
│   │   ├── Achievements.tsx     # Achievements & Badges feature
│   │   ├── AICompanion.tsx      # Main Smart AI Companion feature
│   │   ├── BottomNavBar.tsx     # Mobile bottom navigation
│   │   ├── DailyGoals.tsx       # Daily Goals feature
│   │   ├── GemShop.tsx          # Gem Shop feature
│   │   ├── GlobalAudioPlayer.tsx# Global audio player in header
│   │   ├── IqraBookView.tsx     # Iqra learning interface
│   │   ├── LearningPath.tsx     # Learning Path feature
│   │   ├── Leaderboard.tsx      # Leaderboard feature
│   │   ├── LiveConversation.tsx # AI Voice Chat feature
│   │   ├── PurchaseGemsModal.tsx# Gem purchase simulation modal
│   │   ├── QuranReader.tsx      # Main Quran reader component
│   │   ├── Sidebar.tsx          # Desktop navigation sidebar
│   │   ├── TajweedTutor.tsx     # Tajweed Tutor parent component
│   │   └── ...                  # Other feature components
│   │
│   ├── context/
│   │   └── AudioContext.tsx     # Global audio state management
│   │
│   ├── data/
│   │   ├── asmaulHusnaData.ts   # Static data for Asmaul Husna
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useAutoplay.ts       # Logic for Quran autoplay feature
│   │   ├── useQuranData.ts      # Logic for loading surah data
│   │   └── useSpeechRecognition.ts # Speech recognition logic
│   │
│   ├── services/
│   │   ├── dbService.ts         # IndexedDB interactions (caching)
│   │   ├── geminiService.ts     # API client for proxy server
│   │   └── ...
│   │
│   ├── App.tsx                  # Root component, managing active view & layout
│   ├── index.tsx                # React application entry point
│   └── types.ts                 # Global TypeScript type definitions
│
├── index.html                   # Main HTML file with import maps & Tailwind CSS
└── README.md                    # Documentation
```

## Building and Running

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. The application will be available at `http://localhost:3000`

### Production Build
- Build for production: `npm run build`
- Preview production build: `npm run start`

### Configuration
- The application uses a Vite-based build system
- API keys for Google Gemini are expected to be provided via environment variables in the server environment
- Browser permissions requested when needed: Microphone for AI features and Geolocation for prayer times and Qibla

## Development Conventions

### Code Quality
- Uses TypeScript for type safety
- Implements React best practices with hooks and context
- Follows mobile-first responsive design principles
- Uses Tailwind CSS for styling with custom configuration
- Implements code splitting and lazy loading for performance

### Performance Optimizations
- Code Splitting: Major components are dynamically imported using `React.lazy()`
- Advanced Caching: Critical data like verse explanations and Iqra content is stored in IndexedDB
- Memoization: Components in long lists use `React.memo` to prevent unnecessary re-renders
- Custom Hooks: Complex logic is separated into custom hooks for cleaner, reusable code
- Proxy Server: All Gemini API calls are routed through an Express.js proxy server to ensure API keys are not exposed on the client side

### AI Ethics
- QuranPulse is committed to providing ethical and trustworthy content
- The `AskUstaz` feature is programmed to refer ONLY to authoritative sources in Malaysia
- AI is transparently marked as such to users
- AI is prohibited from issuing fatwas or replacing qualified scholars
- Audio recordings for Tajweed analysis are not stored, and no personal data is collected

## Deployment
- Deployed on Vercel with proper rewrites and build configuration
- Uses Vite framework configuration for optimal performance
- Implements proper error boundaries and loading states