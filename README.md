# 🕌 QuranPulse: Al-Quran SuperApp untuk Malaysia

QuranPulse ialah sebuah aplikasi super Al-Quran yang canggih dan boleh dipercayai, direka khusus untuk komuniti Muslim di Malaysia. Aplikasi ini menggabungkan alatan ibadah harian yang penting dengan ciri-ciri pembelajaran termaju yang dikuasakan oleh Google Gemini, serta sistem gamifikasi yang mendalam untuk motivasi, semuanya dibentangkan dalam antara muka yang dioptimumkan untuk peranti mudah alih (*mobile-first*), beretika, dan mesra pengguna.

Aplikasi ini dibina dengan prestasi sebagai keutamaan, menggunakan teknik moden seperti pemisahan kod (*code splitting*), pemuatan data malas (*lazy loading*), dan strategi cache-first untuk memastikan pengalaman yang pantas dan responsif, walaupun dalam keadaan luar talian.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-blueviolet.svg)](https://ai.google.dev/)

---

## 📖 Kandungan

- [Ciri-Ciri Utama](#-ciri-ciri-utama)
- [Timbunan Teknologi](#-timbunan-teknologi-technology-stack)
- [Struktur Projek](#-struktur-projek)
- [Pengoptimuman Prestasi](#-pengoptimuman-prestasi)
- [Konfigurasi](#-konfigurasi)
- [Etika & Sumber Data](#-etika--sumber-data)
- [License](#-license)
- [Credits](#-credits)

---

## ✨ Ciri-Ciri Utama

QuranPulse dibina dengan set ciri yang kaya untuk membantu pengguna dalam perjalanan rohani dan pembelajaran mereka.

### 🕋 Keperluan Ibadah Harian

*   **Pembaca Al-Quran:** Baca Al-Quran dengan teks Uthmani yang jelas. Dilengkapi dengan **Audio Murattal** daripada qari terkenal (Mishary Rashid Alafasy) dan ciri autoplay.
*   **Terjemahan Pelbagai Bahasa:** Terjemahan dalam Bahasa Melayu (Tafsir Pimpinan Ar-Rahman), Bahasa Inggeris (Sahih International), dan transliterasi Rumi untuk membantu sebutan.
*   **Waktu Solat & Qiblat:** Dapatkan waktu solat yang tepat untuk seluruh Malaysia dan cari arah Qiblat dengan kompas bersepadu.
*   **Penjejak Ibadah & Doa Harian:** Jejaki amalan harian anda dan akses koleksi doa masnun dan zikir yang dilengkapi dengan pembilang digital interaktif.
*   **Kandungan Islamik Kaya:** Terokai **Asmaul Husna**, **Tafsir**, **Kisah Nabi**, **Panduan Ibadah**, **Tasbih Digital**, **Sirah Nabawiyah**, **Kalendar Hijriyah**, **Artikel Islami**, dan **Penyemak Halal**.

### 🧠 Alatan Pembelajaran Dikuasakan AI (PRO)

*   **Sobat AI Cerdas:** Agen AI serba boleh yang boleh menavigasi aplikasi, menjawab soalan, dan menjana imej untuk membantu pembelajaran.
*   **Tanya Ustaz:** Mod soal jawab formal yang menjawab soalan feqah secara eksklusif daripada sumber berautoriti Malaysia.
*   **Tutor Tajwid AI:** Dapatkan maklum balas masa nyata tentang bacaan Al-Quran atau Iqra' anda menggunakan analisis audio AI.
*   **Pelan Pembelajaran AI:** Rangka jadual pembelajaran atau hafazan yang diperibadikan berdasarkan matlamat anda.
*   **Sembang Suara AI:** Sesi perbualan suara interaktif dengan AI dalam Bahasa Melayu untuk latihan soal jawab.
*   **Penulis Jawi AI:** Tukar teks Rumi ke tulisan Jawi dengan serta-merta.
*   **Penjelasan Ayat AI:** Dapatkan penjelasan ringkas dan mudah difahami untuk mana-mana ayat Al-Quran dengan satu klik.

### 🏆 Gamifikasi & Motivasi

*   **Laluan Pembelajaran (`LearningPath.tsx`):** Ikuti kurikulum berstruktur dari asas Iqra' hingga ke tajwid lanjutan dan hafazan surah dalam bentuk peta yang interaktif.
*   **Matlamat Harian (`DailyGoals.tsx`):** Tetapkan sasaran XP harian dan selesaikan matlamat khusus untuk mendapatkan ganjaran.
*   **Cabaran Mingguan & Bulanan:** Sertai cabaran jangka panjang seperti "Marathon Mingguan" atau "Hafazan Juz 30" untuk hadiah yang lebih besar.
*   **Papan Markah (`Leaderboard.tsx`):** Bersaing dengan rakan, pengguna tempatan (Malaysia), dan global. Naik atau turun liga berdasarkan prestasi mingguan anda.
*   **Pencapaian & Lencana (`Achievements.tsx`):** Buka puluhan lencana unik dengan melengkapkan pelbagai tugasan merentasi kategori seperti pembelajaran, sosial, dan peristiwa istimewa.
*   **Kedai Permata (`GemShop.tsx`):** Gunakan permata yang diperoleh untuk membeli item dalam permainan seperti *power-up* (cth., Streak Freeze), item kosmetik, atau akses premium.
*   **Pembelian Dalam Aplikasi (Simulasi):** Alami aliran pembelian pek permata melalui modal pembayaran yang berinteraksi dengan backend simulasi, meniru gerbang pembayaran seperti "Chip-In".

---

## 🚀 Timbunan Teknologi (Technology Stack)

### Frontend
*   **Framework:** React 19 (dimuat melalui CDN menggunakan *import maps*)
*   **Bahasa:** TypeScript
*   **Styling:** Tailwind CSS (dikonfigurasi secara terus dalam HTML)
*   **Reka Bentuk:** *Mobile-First Responsive Design*, dengan navigasi bawah untuk peranti mudah alih dan bar sisi untuk desktop.
*   **State Management:** React Context API & Hooks (`useState`, `useEffect`, `useContext`)
*   **Icons:** Komponen SVG kustom dalam `components/icons/Icons.tsx`

### Backend (Pelayan Proksi)
*   **Framework:** Express.js
*   **Tujuan:** Mengurus kunci API dengan selamat, mengendalikan permintaan ke API Gemini, dan menyediakan titik akhir untuk logik aplikasi seperti simulasi pembayaran.

### Kecerdasan Buatan (AI)
*   **Provider:** Google Gemini API (`@google/genai`)
*   **Model Digunakan:** `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-image`, `gemini-2.5-flash-native-audio-preview-09-2025` (Live API), `gemini-2.5-flash-preview-tts`.

### API & Sumber Data
*   **Teks Al-Quran & Terjemahan:** `api.alquran.cloud`
*   **Audio Bacaan:** `everyayah.com`
*   **Waktu Solat:** `api.aladhan.com` (sebagai proksi untuk data e-Solat JAKIM)
*   **Data Statik:** Data Iqra', Asmaul Husna, dan senarai Surah disimpan secara tempatan untuk prestasi optimum.

### Storan & API Pelayar
*   **IndexedDB:** Untuk *caching* data aplikasi (sembang, pelan belajar, sesi tajwid, penjelasan ayat).
*   **Local Storage:** Untuk menyimpan progres ringkas seperti penjejak ibadah dan kiraan zikir.
*   **Geolocation API:** Untuk Qiblat & Waktu Solat.
*   **Media Devices API (Mikrofon):** Untuk ciri-ciri audio interaktif.
*   **Web Audio API:** Untuk pemprosesan dan main balik audio.

---

## 📂 Struktur Projek

Struktur projek direka untuk menjadi modular dan mudah diselenggara, dengan pemisahan kebimbangan yang jelas.

```
quranpulse/
├── public/
│   └── data/
│       └── iqraData.json      # Data statik Iqra' (dioptimumkan)
├── server/
│   └── src/
│       ├── routes/
│       │   └── api.ts         # Pengendali laluan untuk proksi Gemini
│       └── index.ts           # Titik masukan pelayan Express
├── src/
│   ├── components/
│   │   ├── ui/                  # Komponen UI boleh guna semula (Button, Card)
│   │   ├── icons/               # Komponen ikon SVG
│   │   ├── Achievements.tsx     # Ciri Pencapaian & Lencana
│   │   ├── AICompanion.tsx      # Ciri utama Sobat AI Cerdas
│   │   ├── BottomNavBar.tsx     # Navigasi bawah untuk mudah alih
│   │   ├── DailyGoals.tsx       # Ciri Matlamat Harian
│   │   ├── GemShop.tsx          # Ciri Kedai Permata
│   │   ├── GlobalAudioPlayer.tsx# Pemain audio global di header
│   │   ├── IqraBookView.tsx     # Antara muka pembelajaran Iqra'
│   │   ├── LearningPath.tsx     # Ciri Laluan Pembelajaran
│   │   ├── Leaderboard.tsx      # Ciri Papan Markah
│   │   ├── LiveConversation.tsx # Ciri Sembang Suara AI
│   │   ├── PurchaseGemsModal.tsx# Modal simulasi pembelian permata
│   │   ├── QuranReader.tsx      # Komponen utama pembaca Al-Quran
│   │   ├── Sidebar.tsx          # Bar sisi navigasi untuk desktop
│   │   ├── TajweedTutor.tsx     # Komponen induk untuk Tutor Tajwid
│   │   └── ...                  # Komponen ciri lain
│   │
│   ├── context/
│   │   └── AudioContext.tsx     # Pengurusan state audio global
│   │
│   ├── data/
│   │   ├── asmaulHusnaData.ts   # Data statik untuk Asmaul Husna
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useAutoplay.ts       # Logik untuk ciri autoplay Al-Quran
│   │   ├── useQuranData.ts      # Logik untuk memuatkan data surah
│   │   └── useSpeechRecognition.ts # Logik pengecaman pertuturan
│   │
│   ├── services/
│   │   ├── dbService.ts         # Interaksi dengan IndexedDB (cache)
│   │   ├── geminiService.ts     # Klien API yang berinteraksi dengan pelayan proksi
│   │   └── ...
│   │
│   ├── App.tsx                  # Komponen akar, menguruskan paparan aktif & layout
│   ├── index.tsx                # Titik masukan aplikasi React
│   └── types.ts                 # Definisi jenis TypeScript global
│
├── index.html                   # Fail HTML utama dengan import maps & Tailwind CSS
└── README.md                    # Dokumentasi ini
```

---

## ⚡ Pengoptimuman Prestasi

Aplikasi ini telah dioptimumkan secara menyeluruh untuk kelajuan dan kecekapan.

- **Pemisahan Kod (*Code Splitting*):** Komponen-komponen utama dimuat secara dinamik menggunakan `React.lazy()` dan `Suspense`, mengurangkan saiz muatan awal dengan ketara.
- **Caching Lanjutan:** Data penting seperti penjelasan ayat dan kandungan Iqra' disimpan dalam IndexedDB untuk akses luar talian dan pemuatan segera pada lawatan seterusnya.
- **Memoization:** Komponen dalam senarai panjang seperti `AyahView` menggunakan `React.memo` untuk mengelakkan render semula yang tidak perlu.
- **Struktur Hook Kustom:** Logik kompleks diasingkan ke dalam cangkuk (*hooks*) kustom seperti `useQuranData` dan `useAutoplay` untuk kod yang lebih bersih dan boleh diguna semula.
- **Pelayan Proksi:** Semua panggilan ke API Gemini disalurkan melalui pelayan proksi Express.js, memastikan kunci API tidak terdedah di bahagian klien.

---

## ⚙️ Konfigurasi

### Kunci API Google Gemini

Aplikasi ini memerlukan kunci API Google Gemini untuk berfungsi. Kunci ini diuruskan oleh pelayan proksi dan dijangka akan disediakan melalui pembolehubah persekitaran `process.env.GEMINI_API_KEY` di persekitaran pelayan. **Tidak perlu** mengkonfigurasi fail `.env` atau memasukkan kunci API secara manual dalam kod klien.

### Kebenaran Pelayar

Aplikasi akan meminta kebenaran berikut apabila diperlukan:
- **🎤 Mikrofon:** Diperlukan untuk *Tutor Tajwid AI* dan *Sembang Suara AI*.
- **📍 Lokasi (Geolocation):** Diperlukan untuk *Waktu Solat* dan *Kompas Qiblat*.

---

## ⚖️ Etika & Sumber Data

QuranPulse komited untuk menyediakan kandungan yang beretika dan boleh dipercayai.

### 📚 Sumber Data Berautoriti

Ciri `TanyaUstaz` diprogramkan untuk merujuk **HANYA** kepada sumber yang diiktiraf di Malaysia (Al-Quran, Tafsir Pimpinan Ar-Rahman, MyHadith, e-Fatwa JAKIM) untuk memastikan jawapan yang selamat dan boleh dipercayai.

### 🛡️ Prinsip Etika AI

- **Ketelusan:** Pengguna sentiasa dimaklumkan apabila mereka berinteraksi dengan AI.
- **Keselamatan:** AI dilarang sama sekali daripada mengeluarkan fatwa atau menggantikan peranan ulama bertauliah.
- **Privasi:** Rakaman audio untuk analisis Tajwid tidak disimpan. Data peribadi tidak dikumpul.

> **Penafian:** Semua ciri AI adalah alat bantuan pembelajaran dan bukan pengganti nasihat daripada alim ulama yang bertauliah. Untuk isu-isu fiqh yang kompleks, sila rujuk kepada ustaz atau mufti yang berkelayakan.

---

## 📜 License

Projek ini dilesenkan di bawah [MIT License](LICENSE). Anda bebas untuk menggunakan, mengubah suai, dan mengedarkan kod ini.

---

## 🙏 Credits & Acknowledgments

- **Kandungan Islamik:** Tanzil Project, Tafsir Pimpinan Ar-Rahman, Sahih International, Sheikh Mishary Rashid Alafasy.
- **Sumber Rasmi:** JAKIM (e-Solat, e-Fatwa), MyHadith.
- **Teknologi:** Google (untuk model Gemini), Pasukan React, Pasukan TypeScript, Tailwind Labs.

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

Dibuat dengan ❤️ untuk Ummah

**QuranPulse** - Teman Harian Anda untuk Pertumbuhan Rohani

</div>
# Vercel Deployment Test
