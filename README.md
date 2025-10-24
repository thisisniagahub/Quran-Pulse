# 🕌 QuranPulse: Al-Quran SuperApp untuk Malaysia

QuranPulse ialah sebuah aplikasi super Al-Quran yang canggih dan boleh dipercayai, direka khusus untuk komuniti Muslim di Malaysia. Aplikasi ini menggabungkan alatan ibadah harian yang penting dengan ciri-ciri pembelajaran termaju yang dikuasakan oleh AI, semuanya dibentangkan dalam antara muka pengguna yang minimalis, beretika, dan mesra pengguna.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

---

## 📖 Kandungan

- [Ciri-Ciri Utama](#-ciri-ciri-utama)
- [Demo & Screenshots](#-demo--screenshots)
- [Pelan Subscription](#-pelan-subscription)
- [Timbunan Teknologi](#-timbunan-teknologi-technology-stack)
- [Persediaan & Pemasangan](#-persediaan--pemasangan)
- [Konfigurasi](#-konfigurasi)
- [Struktur Projek](#-struktur-projek)
- [Deployment](#-deployment)
- [Kos & Penggunaan API](#-kos--penggunaan-api)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Etika & Sumber Data](#-etika--sumber-data)
- [License](#-license)
- [Credits](#-credits)

---

## ✨ Ciri-Ciri Utama

QuranPulse dibina dengan set ciri yang kaya untuk membantu pengguna dalam perjalanan rohani dan pembelajaran mereka.

### 🕋 Keperluan Ibadah Harian

*   **Pembaca Al-Quran:** Baca Al-Quran dengan teks Uthmani yang jelas, terjemahan Bahasa Melayu (Tafsir Pimpinan Ar-Rahman) dan Bahasa Inggeris (Sahih International).
*   **Audio Murattal:** Dengar bacaan ayat demi ayat daripada qari terkenal (Mishary Rashid Alafasy).
*   **Waktu Solat:** Dapatkan waktu solat yang tepat untuk bandar-bandar utama di seluruh Malaysia, disahkan melalui API e-Solat JAKIM.
*   **Kompas Qiblat:** Cari arah Qiblat dengan mudah menggunakan penderia peranti anda.
*   **Penjejak Ibadah:** Pantau dan jejak amalan harian anda seperti solat fardhu, solat sunat, bacaan Al-Quran, dan banyak lagi.
*   **Doa & Zikir:** Akses koleksi doa masnun dan zikir harian yang dilengkapi dengan pembilang digital.

### 🧠 Alatan Pembelajaran Dikuasakan AI (Google Gemini)

*   **Tutor Tajwid AI (PRO):** Dapatkan maklum balas masa nyata tentang bacaan Iqra' atau Al-Quran anda. AI menganalisis sebutan anda (makhraj dan harakat) dan memberikan nasihat yang membina.
*   **Rujukan Ustaz AI:** Ajukan soalan-soalan berkaitan Islam dan dapatkan jawapan yang dirujuk secara eksklusif daripada sumber-sumber berautoriti di Malaysia: Al-Quran, Tafsir Pimpinan Ar-Rahman, MyHadith, dan portal e-Fatwa JAKIM.
*   **Pelan Pembelajaran AI:** Rancang jadual pembelajaran atau hafazan Al-Quran yang diperibadikan. Tetapkan matlamat, tempoh, dan tahap semasa anda, dan biarkan AI merangka pelan harian yang terperinci.
*   **Sembang Suara AI (PRO):** Berbual secara langsung dengan pembantu AI Islamik ("Sobat Suara") untuk latihan perbualan atau sesi soal jawab yang lebih interaktif.
*   **Penulis Jawi AI:** Tukar teks Rumi ke tulisan Jawi dengan serta-merta.
*   **Penjelasan Ayat AI:** Dapatkan penjelasan ringkas dan mudah difahami untuk mana-mana ayat Al-Quran.
*   **Audio Respons AI:** Semua respons daripada Ustaz AI dan Sobat AI boleh dimainkan sebagai audio (teks-ke-ucapan) untuk pengalaman mendengar.

---

## 📱 Demo & Screenshots

### 🎥 Live Demo
🔗 [Tonton Demo Video](https://youtube.com/demo) | 🌐 [Cuba Live Demo](https://quranpulse.app)

### 📸 Screenshots

| Pembaca Al-Quran | Tutor Tajwid AI |
|:----------------:|:---------------:|
| ![Quran Reader](./screenshots/quran-reader.png) | ![Tajweed Tutor](./screenshots/tajweed-tutor.png) |

| Waktu Solat | Ustaz AI |
|:-----------:|:--------:|
| ![Prayer Times](./screenshots/prayer-times.png) | ![Tanya Ustaz](./screenshots/tanya-ustaz.png) |

---

## 💎 Pelan Subscription

| Feature | FREE | PRO |
|---------|:----:|:---:|
| Pembaca Al-Quran | ✅ | ✅ |
| Audio Murattal | ✅ | ✅ |
| Waktu Solat | ✅ | ✅ |
| Kompas Qiblat | ✅ | ✅ |
| Rujukan Ustaz AI | 10 soalan/hari | Unlimited |
| Penjelasan Ayat AI | ✅ | ✅ |
| Penulis Jawi AI | ✅ | ✅ |
| **Tutor Tajwid AI** | ❌ | ✅ |
| **Sembang Suara AI** | ❌ | ✅ |
| Pelan Pembelajaran AI | 1 pelan/bulan | Unlimited |
| Audio Respons AI | Terhad | Unlimited |
| Penjejak Ibadah Advanced | ❌ | ✅ |

**Harga PRO:** RM 9.90/bulan atau RM 99/tahun (jimat 17%)

---

## 🚀 Timbunan Teknologi (Technology Stack)

### Frontend
*   **Framework:** React 18.2+ dengan TypeScript
*   **Styling:** Tailwind CSS 3.4+
*   **Build Tool:** Vite 5.0+
*   **State Management:** React Context API + Hooks
*   **Routing:** React Router DOM 6.x
*   **Icons:** Lucide React

### Kecerdasan Buatan (AI)
*   **Provider:** Google Gemini API (`@google/generative-ai`)
*   **Models:**
    *   `gemini-2.0-flash-exp` untuk Rujukan Ustaz AI yang mendalam
    *   `gemini-2.0-flash-lite` untuk chatbot, perancangan, dan tugas-tugas pantas
    *   `gemini-2.0-flash-native-audio-preview` (Live API) untuk Tutor Tajwid dan Sembang Suara masa nyata
    *   `gemini-2.0-flash-tts` untuk penjanaan teks-ke-ucapan

### API & Data Sources
*   **Al-Quran Text & Translation:** `api.alquran.cloud`
*   **Audio Recitation:** `everyayah.com` (Mishary Rashid Alafasy)
*   **Prayer Times:** `api.aladhan.com`
*   **Malaysian Sources:** e-Solat JAKIM, e-Fatwa JAKIM, MyHadith

### Browser APIs
*   Geolocation API (untuk Qiblat & Waktu Solat)
*   Media Devices API (untuk Mikrofon)
*   Web Audio API (untuk pemprosesan audio)

---

## 📦 Persediaan & Pemasangan

### Keperluan Sistem

Pastikan sistem anda mempunyai:

- **Node.js:** v18.0 atau lebih tinggi
- **Package Manager:** npm 9.0+ / yarn 1.22+ / pnpm 8.0+
- **Pelayar Moden:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Sambungan Internet:** Untuk API calls dan audio streaming

### 1️⃣ Clone Repository

```bash
# Clone repositori
git clone https://github.com/yourusername/quranpulse.git

# Masuk ke directory projek
cd quranpulse
```

### 2️⃣ Install Dependencies

```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install

# Atau menggunakan pnpm
pnpm install
```

### 3️⃣ Dapatkan Kunci API Google Gemini

1. Pergi ke [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Log masuk dengan akaun Google anda
3. Klik **"Get API Key"** atau **"Create API Key"**
4. Pilih project atau create project baru
5. Salin kunci API yang dijana

> **💡 Tip:** Simpan kunci API dengan selamat. Jangan kongsikan atau commit ke Git!

### 4️⃣ Konfigurasi Environment Variables

Buat fail `.env` di root folder projek:

```bash
# Copy template
cp .env.example .env
```

Edit fail `.env` dan masukkan kunci API anda:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_api_key_here

# Optional: Analytics & Monitoring
VITE_GA_TRACKING_ID=your_ga_id_here
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### 5️⃣ Jalankan Development Server

```bash
# Start dev server
npm run dev

# Aplikasi akan berjalan di http://localhost:5173
```

### 6️⃣ Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Konfigurasi

### Kebenaran Pelayar

Aplikasi memerlukan kebenaran berikut:

#### 🎤 Mikrofon
**Diperlukan untuk:**
- Tutor Tajwid AI
- Sembang Suara AI

```javascript
// Aplikasi akan automatically request permission
navigator.mediaDevices.getUserMedia({ audio: true })
```

#### 📍 Lokasi (Geolocation)
**Diperlukan untuk:**
- Waktu Solat
- Kompas Qiblat

```javascript
// Permission akan diminta apabila user akses features ini
navigator.geolocation.getCurrentPosition(...)
```

### Konfigurasi Tambahan

Edit fail `src/config.ts` untuk customize settings:

```typescript
export const config = {
  // API Endpoints
  quranAPI: 'https://api.alquran.cloud/v1',
  audioAPI: 'https://everyayah.com/data',
  prayerAPI: 'https://api.aladhan.com/v1',
  
  // Gemini Models
  geminiModels: {
    ustaz: 'gemini-2.0-flash-exp',
    chatbot: 'gemini-2.0-flash-lite',
    tajweed: 'gemini-2.0-flash-native-audio-preview',
    tts: 'gemini-2.0-flash-tts'
  },
  
  // App Settings
  defaultLanguage: 'ms',
  defaultQari: 'mishary',
  cacheEnabled: true
}
```

---

## 📂 Struktur Projek

```
quranpulse/
├── public/
│   ├── icons/                 # App icons & PWA assets
│   └── fonts/                 # Custom fonts (Uthmani, Jawi)
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx           # Main navigation sidebar
│   │   │   ├── Header.tsx            # Top app header
│   │   │   └── Footer.tsx            # Footer component
│   │   │
│   │   ├── quran/
│   │   │   ├── QuranReader.tsx       # Main Quran reading interface
│   │   │   ├── SurahList.tsx         # Surah selection list
│   │   │   ├── AyahCard.tsx          # Individual ayah display
│   │   │   └── BookmarkManager.tsx   # Bookmark management
│   │   │
│   │   ├── prayer/
│   │   │   ├── PrayerTimes.tsx       # Prayer times display
│   │   │   ├── QiblaCompass.tsx      # Qibla direction compass
│   │   │   └── AdhanNotification.tsx # Adhan alerts
│   │   │
│   │   ├── tajweed/
│   │   │   ├── TajweedTutor.tsx      # Parent tutor component
│   │   │   ├── TajweedCoach.tsx      # Live audio coaching
│   │   │   ├── TajweedSelector.tsx   # Material selection
│   │   │   └── IqraBookView.tsx      # Iqra book viewer
│   │   │
│   │   ├── ai/
│   │   │   ├── TanyaUstaz.tsx        # Ustaz AI chat interface
│   │   │   ├── AIChatbot.tsx         # General chatbot (Sobat AI)
│   │   │   ├── LiveConversation.tsx  # Voice chat interface
│   │   │   ├── AyahExplainer.tsx     # Ayah explanation tool
│   │   │   ├── JawiConverter.tsx     # Rumi to Jawi converter
│   │   │   └── LearningPlanner.tsx   # AI study planner
│   │   │
│   │   ├── tracker/
│   │   │   ├── IbadahTracker.tsx     # Daily ibadah tracking
│   │   │   ├── HabitStreak.tsx       # Streak visualization
│   │   │   └── Statistics.tsx        # Analytics dashboard
│   │   │
│   │   ├── audio/
│   │   │   ├── GlobalAudioPlayer.tsx # Global audio player
│   │   │   └── AudioControls.tsx     # Playback controls
│   │   │
│   │   ├── dua/
│   │   │   ├── DuaCollection.tsx     # Dua list & viewer
│   │   │   └── TasbihCounter.tsx     # Digital tasbih counter
│   │   │
│   │   └── shared/
│   │       ├── Button.tsx            # Reusable button component
│   │       ├── Modal.tsx             # Modal dialog
│   │       ├── LoadingSpinner.tsx    # Loading indicator
│   │       └── ErrorBoundary.tsx     # Error handling
│   │
│   ├── context/
│   │   ├── AudioContext.tsx          # Audio state management
│   │   ├── ThemeContext.tsx          # Dark/light mode
│   │   ├── AuthContext.tsx           # User authentication
│   │   └── SubscriptionContext.tsx   # PRO subscription status
│   │
│   ├── hooks/
│   │   ├── useAudioPlayer.ts         # Audio player hook
│   │   ├── useGeolocation.ts         # Location hook
│   │   ├── usePrayerTimes.ts         # Prayer times hook
│   │   ├── useQibla.ts               # Qibla calculation hook
│   │   └── useLocalStorage.ts        # Local storage hook
│   │
│   ├── services/
│   │   ├── geminiService.ts          # Google Gemini API client
│   │   ├── quranService.ts           # Quran data fetching
│   │   ├── prayerService.ts          # Prayer times API
│   │   └── storageService.ts         # LocalStorage management
│   │
│   ├── data/
│   │   ├── iqraData.ts               # Iqra 1-6 content
│   │   ├── duaData.ts                # Dua & zikir collection
│   │   └── surahInfo.ts              # Surah metadata
│   │
│   ├── utils/
│   │   ├── audio.ts                  # Audio processing utilities
│   │   ├── date.ts                   # Hijri date conversion
│   │   ├── qibla.ts                  # Qibla calculation
│   │   └── format.ts                 # Text formatting helpers
│   │
│   ├── types/
│   │   ├── quran.ts                  # Quran type definitions
│   │   ├── prayer.ts                 # Prayer types
│   │   └── ai.ts                     # AI response types
│   │
│   ├── styles/
│   │   ├── globals.css               # Global styles & Tailwind
│   │   └── animations.css            # Custom animations
│   │
│   ├── App.tsx                       # Root component
│   ├── main.tsx                      # Entry point
│   └── config.ts                     # App configuration
│
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── README.md                         # Documentation
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push kod ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

```bash
# Atau guna Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. Build aplikasi: `npm run build`
2. Drag & drop folder `dist` ke [Netlify](https://netlify.com)
3. Atau connect GitHub repository
4. Set environment variables di Netlify dashboard

```bash
# Atau guna Netlify CLI
npm i -g netlify-cli
netlify deploy --prod
```

### Environment Variables untuk Production

Pastikan set variables berikut:

```env
VITE_GEMINI_API_KEY=your_production_api_key
VITE_APP_URL=https://quranpulse.app
VITE_API_BASE_URL=https://api.quranpulse.app
```

### Custom Domain

1. Beli domain (contoh: quranpulse.app)
2. Point DNS ke hosting platform
3. Enable SSL/HTTPS
4. Update environment variables

---

## 💰 Kos & Penggunaan API

### Google Gemini API Pricing (Estimates)

**Free Tier:**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

**Paid Tier:**
- $0.00025 per 1K characters (input)
- $0.0005 per 1K characters (output)

### Estimated Costs per Feature

| Feature | API Calls | Est. Cost/User/Month |
|---------|-----------|----------------------|
| Ustaz AI | 30-100 | $0.05 - $0.20 |
| Ayah Explainer | 50-150 | $0.03 - $0.10 |
| Learning Planner | 5-10 | $0.02 - $0.05 |
| Tajweed Tutor (PRO) | 20-60 | $0.10 - $0.30 |
| Voice Chat (PRO) | 10-30 | $0.15 - $0.40 |

**💡 Pro tip:** Implement caching untuk reduce API costs!

### Quota Management

```typescript
// Implement rate limiting
const rateLimiter = {
  free: {
    ustazAI: 10,  // per day
    explainer: 20,
    planner: 1    // per month
  },
  pro: {
    ustazAI: -1,  // unlimited
    explainer: -1,
    planner: -1
  }
}
```

---

## 🔧 Troubleshooting

### ❌ API Key Tidak Berfungsi

**Simptom:** Error "Invalid API key" atau "403 Forbidden"

**Penyelesaian:**
```bash
# 1. Semak .env file
cat .env

# 2. Pastikan format betul (tiada spacing)
VITE_GEMINI_API_KEY=AIzaSyD... (tanpa quotes atau spaces)

# 3. Restart dev server
npm run dev

# 4. Clear browser cache dan reload
```

### 🎤 Mikrofon Tidak Berfungsi

**Simptom:** "Permission denied" atau audio tidak detected

**Penyelesaian:**
1. Check browser permissions di Settings
2. Pastikan HTTPS enabled (required untuk microphone)
3. Test microphone di browser:
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Mic OK'))
  .catch(err => console.error('Mic error:', err))
```

### 📍 Lokasi Tidak Tepat

**Simptom:** Prayer times atau Qibla salah

**Penyelesaian:**
1. Enable location services di device
2. Grant location permission di browser
3. Manual set location:
```typescript
// Di settings page
setLocation({
  city: 'Kuala Lumpur',
  lat: 3.139,
  lng: 101.687
})
```

### 🐌 App Loading Lambat

**Penyelesaian:**
```bash
# 1. Enable code splitting
# 2. Lazy load components
const TajweedTutor = lazy(() => import('./components/TajweedTutor'))

# 3. Optimize bundle size
npm run build -- --analyze

# 4. Enable PWA caching
# 5. Use CDN untuk static assets
```

### 📱 PWA Tidak Install

**Penyelesaian:**
1. Pastikan served via HTTPS
2. Check manifest.json
3. Register service worker:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

### 🔍 Common Error Messages

| Error | Sebab | Penyelesaian |
|-------|-------|-------------|
| `CORS Error` | API blocked | Use proxy atau backend |
| `Quota Exceeded` | API limit reached | Wait atau upgrade plan |
| `Network Error` | No internet | Check connection |
| `Audio Load Failed` | CDN issue | Retry atau use backup source |

### 📞 Masih Ada Masalah?

- 📧 Email: support@quranpulse.app
- 💬 Discord: [Join Community](https://discord.gg/quranpulse)
- 🐛 GitHub Issues: [Report Bug](https://github.com/username/quranpulse/issues)

---

## 🤝 Contributing

Kami amat menghargai sumbangan daripada komuniti! Sama ada anda nak fix bug, tambah feature, atau improve documentation.

### 📋 Code of Conduct

Projek ini mengamalkan [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Dengan menyertai projek ini, anda bersetuju untuk mematuhi terma-termanya.

### 🛠️ Bagaimana Nak Contribute

#### 1. Fork & Clone

```bash
# Fork repositori di GitHub
# Kemudian clone fork anda
git clone https://github.com/YOUR_USERNAME/quranpulse.git
cd quranpulse
```

#### 2. Create Branch

```bash
# Create branch baru untuk feature/bugfix
git checkout -b feature/nama-feature
# atau
git checkout -b bugfix/nama-bug
```

#### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments untuk complex logic
- Update documentation jika perlu

#### 4. Test Your Changes

```bash
# Run tests
npm run test

# Run linter
npm run lint

# Build untuk ensure no errors
npm run build
```

#### 5. Commit & Push

```bash
# Commit dengan clear message
git add .
git commit -m "feat: add new tajweed feature"
git push origin feature/nama-feature
```

#### 6. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Pilih branch anda
4. Write clear description tentang changes
5. Submit PR!

### 📝 Commit Message Guidelines

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

**Examples:**
```bash
git commit -m "feat: add voice chat feature"
git commit -m "fix: resolve audio playback issue"
git commit -m "docs: update API documentation"
```

### 🎨 Code Style Guidelines

**TypeScript/React:**
```typescript
// Use functional components
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Use hooks
  const [state, setState] = useState<Type>(initialValue)
  
  // Early returns
  if (!data) return <Loading />
  
  // Clear JSX
  return (
    <div className="container">
      <h1>{title}</h1>
    </div>
  )
}
```

**Tailwind CSS:**
```tsx
// Group related utilities
className="
  flex items-center justify-between
  px-4 py-2
  bg-white dark:bg-gray-800
  rounded-lg shadow-md
  hover:shadow-lg transition-shadow
"
```

### 🐛 Reporting Bugs

Jumpa bug? [Create an issue](https://github.com/username/quranpulse/issues/new) dengan:

- **Title:** Clear bug description
- **Description:** What happened vs what expected
- **Steps to Reproduce:** Step by step
- **Environment:** Browser, OS, version
- **Screenshots:** Jika applicable

### 💡 Suggesting Features

Ada idea? [Open a discussion](https://github.com/username/quranpulse/discussions)!

Include:
- Feature description
- Use case/problem it solves
- Mockups (optional)
- Implementation ideas (optional)

### 👥 Contributors

Terima kasih kepada semua contributors! 🙏

[![Contributors](https://contrib.rocks/image?repo=username/quranpulse)](https://github.com/username/quranpulse/graphs/contributors)

---

## ⚖️ Etika & Sumber Data

QuranPulse komited untuk menyediakan kandungan yang beretika dan boleh dipercayai.

### 📚 Sumber Data Berautoriti

Aplikasi ini HANYA merujuk kepada sumber-sumber yang diiktiraf di Malaysia:

1. **Al-Quran Al-Karim**
   - Mushaf Uthmani
   - Verified dari King Fahd Complex

2. **Tafsir Pimpinan Ar-Rahman**
   - Tafsir Bahasa Melayu yang diiktiraf
   - Diterbitkan oleh Darul Fikir

3. **MyHadith**
   - Database hadith rasmi Malaysia
   - Disahkan oleh JAKIM

4. **Portal e-Fatwa JAKIM**
   - Fatwa-fatwa rasmi Malaysia
   - Dikeluarkan oleh Jawatankuasa Fatwa Kebangsaan

5. **e-Solat JAKIM**
   - Waktu solat rasmi untuk seluruh Malaysia

### 🛡️ Prinsip Etika AI

#### Transparency
- User sentiasa informed bahawa mereka interact dengan AI
- Limitations AI dijelaskan dengan jelas
- Sources selalu dicite

#### Accuracy
- AI responses checked terhadap authentic sources
- Multiple verification layers
- Regular audits oleh asatizah

#### Privacy
- No personal data disimpan unnecessarily
- Audio recordings NOT stored permanently
- Comply dengan PDPA Malaysia

#### Responsibility
```typescript
// Disclaimer ditunjukkan di setiap AI interaction
const AI_DISCLAIMER = `
  ⚠️ Makluman Penting:
  
  Jawapan AI ini adalah berdasarkan sumber-sumber berautoriti 
  di Malaysia, tetapi ia BUKAN pengganti nasihat daripada 
  alim ulama yang bertauliah.
  
  Untuk isu-isu fiqh yang kompleks atau keputusan penting,
  sila rujuk kepada ustaz atau mufti yang berkelayakan.
`
```

### ❌ Apa Yang AI TIDAK Akan Lakukan

- ❌ Tidak akan issue fatwa
- ❌ Tidak akan jawab soalan aqidah yang controversial
- ❌ Tidak akan buat judgement tentang amalan orang lain
- ❌ Tidak akan promote mana-mana mazhab/sect
- ❌ Tidak akan bagi medical advice
- ❌ Tidak akan replace role ulama

### ✅ Moderasi Kandungan

```typescript
// Content moderation pipeline
const moderateQuery = async (query: string) => {
  // 1. Check untuk inappropriate content
  if (containsInappropriate(query)) {
    return { blocked: true, reason: 'inappropriate' }
  }
  
  // 2. Check untuk scope relevance
  if (!isIslamicQuery(query)) {
    return { 
      blocked: true, 
      reason: 'out_of_scope',
      message: 'Sila tanya soalan berkaitan Islam sahaja'
    }
  }
  
  // 3. Check untuk sensitive topics
  if (isSensitiveTopic(query)) {
    return {
      blocked: true,
      reason: 'sensitive',
      message: 'Sila rujuk terus kepada ustaz untuk topik ini'
    }
  }
  
  return { blocked: false }
}
```

### 🎓 Educational Purpose

Aplikasi ini adalah **alat pembelajaran** dan **pembantu ibadah**, bukan pengganti:
- Guru mengaji
- Ustaz/ustazah
- Kelas agama formal
- Halaqah dan majlis ilmu
- Konsultasi dengan mufti

---

## 📜 License

Projek ini dilesenkan di bawah [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 QuranPulse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND...
```

**Apa Maksudnya:**
- ✅ Boleh guna untuk personal/commercial
- ✅ Boleh modify dan distribute
- ✅ Boleh include dalam projek lain
- ⚠️ Kena include license notice
- ⚠️ Provided "as is" tanpa warranty

---

## 🙏 Credits & Acknowledgments

### 📖 Islamic Content

- **Al-Quran Text:** [Tanzil Project](https://tanzil.net)
- **Tafsir Melayu:** Tafsir Pimpinan Ar-Rahman (Darul Fikir)
- **English Translation:** Sahih International
- **Audio Recitation:** Sheikh Mishary Rashid Alafasy

### 🏛️ Official Sources

- **JAKIM:** e-Solat API, e-Fatwa Portal
- **MyHadith:** Hadith database
- **Aladhan:** Prayer times calculation

### 🤖 Technology Partners

- **Google Gemini:** AI models & API
- **Vercel:** Hosting & deployment
- **Cloudflare:** CDN services

### 👨‍💻 Development

- **Framework:** React Team
- **Language:** TypeScript Team
- **Styling:** Tailwind Labs
- **Icons:** Lucide Icons

### 🌟 Special Thanks

- Para asatizah yang verify kandungan
- Beta testers dari komuniti Muslim Malaysia
- Open source contributors
- Semua yang memberi feedback dan suggestions

### 💝 Support This Project

Jika aplikasi ini bermanfaat, pertimbangkan untuk:

- ⭐ Star repositori ini
- 🐛 Report bugs
- 💡 Suggest features
- 📢 Share dengan rakan-rakan
- 🤝 Contribute code
- ☕ [Buy me a coffee](https://buymeacoffee.com/quranpulse)

---

## 📞 Hubungi Kami

- 🌐 Website: [quranpulse.app](https://quranpulse.app)
- 📧 Email: support@quranpulse.app
- 💬 Discord: [Join Community](https://discord.gg/quranpulse)
- 🐦 Twitter: [@QuranPulse](https://twitter.com/quranpulse)
- 📘 Facebook: [QuranPulse](https://facebook.com/quranpulse)
- 📸 Instagram: [@quranpulse](https://instagram.com/quranpulse)

---

## 📊 Project Status

![Build Status](https://img.shields.io/github/actions/workflow/status/username/quranpulse/ci.yml?branch=main)
![Test Coverage](https://img.shields.io/codecov/c/github/username/quranpulse)
![Version](https://img.shields.io/github/package-json/v/username/quranpulse)
![License](https://img.shields.io/github/license/username/quranpulse)
![Contributors](https://img.shields.io/github/contributors/username/quranpulse)
![Last Commit](https://img.shields.io/github/last-commit/username/quranpulse)

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

Made with ❤️ for the Muslim Ummah

**QuranPulse** - Your Daily Companion for Spiritual Growth

</div>
