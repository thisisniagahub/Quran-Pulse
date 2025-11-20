
<div align="center">

# 🕌 QuranPulse: SuperApp Islam Komprehensif untuk Malaysia

**Visi:** Menjadi teman harian yang memperkasakan pertumbuhan rohani dan intelektual setiap Muslim di Malaysia, dengan menggabungkan alatan ibadah teras dengan teknologi AI termaju dalam satu pengalaman yang lancar, peribadi, dan memotivasi.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-blueviolet.svg)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black.svg)](https://vercel.com/)

</div>

---

**QuranPulse** ialah sebuah SuperApp Islam yang canggih, beretika, dan boleh dipercayai, direka khusus untuk komuniti Muslim di Malaysia. Aplikasi ini bukan sekadar koleksi ciri, tetapi sebuah penyelesaian holistik yang direka dengan teliti untuk menangani cabaran sebenar yang dihadapi oleh Muslim moden. Ia menyatukan ibadah, ilmu, dan motivasi rohani dalam satu pengalaman digital moden.

Aplikasi ini dibina dengan prestasi sebagai keutamaan, menggunakan teknik moden seperti pemisahan kod (*code splitting*), pemuatan data malas (*lazy loading*), dan strategi *cache-first* untuk memastikan pengalaman yang pantas dan responsif, walaupun dalam keadaan luar talian.

---

## 📖 Kandungan

- [Ciri-Ciri Utama](#-ciri-ciri-utama)
  - [Ibadah Harian](#-ibadah-harian)
  - [Alatan Pembelajaran AI (PRO)](#-alatan-pembelajaran-ai-pro)
  - [Gamifikasi & Motivasi](#-gamifikasi--motivasi)
- [Timbunan Teknologi & Rasional](#-timbunan-teknologi--rasional)
- [Prinsip Senibina](#-prinsip-senibina)
- [Struktur Projek Lengkap](#-struktur-projek-lengkap)
- [Bagaimana untuk Bermula (Getting Started)](#-bagaimana-untuk-bermula-getting-started)
- [Titik Akhir API (Backend Endpoints)](#-titik-akhir-api-backend-endpoints)
- [Etika & Pematuhan Syariah](#-etika--pembetuhan-syariah)
- [Hala Tuju Masa Depan](#-hala-tuju-masa-depan)
- [License](#-license)
- [Credits](#-credits)

---

## ✨ Ciri-Ciri Utama

### 🕋 Ibadah Harian

Alatan teras untuk amalan harian, diperhalusi dengan pengalaman pengguna yang moden.

*   **Pembaca Al-Quran:** Teks Uthmani yang jelas dengan **Audio Murattal**, ciri *autoplay*, dan **animasi sorotan ayat** (`highlight-flash`) yang sedang dimainkan.
*   **Terjemahan Pelbagai Bahasa:** Terjemahan Melayu (Tafsir Pimpinan Ar-Rahman), Inggeris (Sahih International), dan transliterasi Rumi dengan suis `on/off` yang mudah.
*   **Waktu Solat & Peringatan 360°:** Waktu solat tepat untuk seluruh Malaysia dengan **peringatan melalui WhatsApp (eksperimental)** yang boleh disesuaikan.
*   **Arah Qiblat Pintar:** Kompas Qiblat bersepadu dengan **panduan kalibrasi** gerakan "angka lapan" untuk ketepatan maksimum.
*   **Penjejak Ibadah Moden:** Jejaki amalan harian dengan antara muka **suis (`Switch`) yang moden dan responsif**.
*   **Tasbih Digital Interaktif:** Pembilang zikir digital dengan **maklum balas getaran dan animasi riak (`ripple`)** pada setiap sentuhan.
*   **Kandungan Islamik Kaya:** Terokai **Asmaul Husna**, **Kisah Nabi**, **Panduan Ibadah**, **Sirah Nabawiyah**, dan banyak lagi dengan **animasi `fade-in-up` berperingkat** untuk pengalaman visual yang lancar.

### 🧠 Alatan Pembelajaran AI (PRO)

Dikuasakan oleh Google Gemini untuk pengalaman pembelajaran yang diperibadikan dan interaktif.

*   **Sobat AI Cerdas:** Agen AI serba boleh untuk menjawab soalan umum dan membantu pembelajaran.
*   **Tanya Ustaz:** Dapatkan jawapan feqah berstruktur yang merujuk kepada sumber berautoriti Malaysia.
*   **Tutor Tajwid AI:** Dapatkan maklum balas masa nyata tentang bacaan Al-Quran atau Iqra' anda.
*   **Pelan Pembelajaran AI:** Rangka jadual pembelajaran atau hafazan yang diperibadikan.
*   **Sembang Suara AI:** Sesi perbualan suara interaktif dengan AI dalam Bahasa Melayu.
*   **Penulis Jawi AI:** Tukar teks Rumi ke Jawi dengan serta-merta.
*   **Editor Imej AI (Baru):** Sunting imej sedia ada dengan memberikan arahan teks. Tukar latar belakang, tambah objek, dan banyak lagi.

### 🏆 Gamifikasi & Motivasi

Mengubah pembelajaran pasif menjadi satu perjalanan yang aktif, menarik, dan memuaskan.

*   **Laluan Pembelajaran (`LearningPath.tsx`):** Ikuti kurikulum berstruktur dari asas Iqra' hingga ke tajwid lanjutan.
*   **Matlamat Harian & Cabaran (`DailyGoals.tsx`):** Selesaikan tugasan untuk mendapatkan ganjaran XP dan permata.
*   **Papan Markah Dinamik (`Leaderboard.tsx`):** Bersaing dalam liga mingguan dengan **reka bentuk podium dinamik** untuk 3 teratas.
*   **Pencapaian & Lencana (`Achievements.tsx`):** Buka puluhan lencana unik untuk meraikan setiap pencapaian.
*   **Sistem "Share the Barakah":** Kongsi pencapaian, petikan, atau ayat ke media sosial dengan kad visual yang dijana secara automatik untuk mendapatkan mata ganjaran.

---

## 🚀 Timbunan Teknologi & Rasional

| Komponen            | Teknologi                                        | Rasional                                                                                                                              |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | React 19, TypeScript, Tailwind CSS             | Pustaka moden, selamat-jenis, dan cekap untuk membina antara muka pengguna yang responsif tanpa langkah binaan (*no build-step*). |
| **Pemuatan Modul**  | Import Maps (`index.html`)                       | Membolehkan resolusi modul seperti `react` secara terus dalam pelayar, mengelakkan keperluan untuk *bundler* seperti Webpack atau Vite.  |
| **Backend (Proksi)**| Express.js di Vercel Serverless Functions        | Menyediakan lapisan keselamatan yang ringan dan boleh skala untuk mengurus kunci API dan berkomunikasi dengan perkhidmatan luaran.     |
| **AI**              | Google Gemini API (`@google/genai`)              | Model AI yang berkuasa untuk pelbagai tugas (teks, audio, imej) dengan sokongan untuk arahan sistem yang terperinci.                |
| **Storan Klien**    | IndexedDB & LocalStorage                         | **IndexedDB** untuk *caching* data besar (surah, tafsir, sejarah sembang) bagi keupayaan luar talian. **LocalStorage** untuk tetapan ringkas. |

---

## 🏛️ Prinsip Senibina

Senibina aplikasi ini direka untuk keselamatan, prestasi, dan kebolehselenggaraan.

1.  **Proksi API Selamat (BFF):** Semua panggilan ke API Gemini disalurkan melalui pelayan proksi `api/index.ts`. Ini memastikan kunci API **tidak pernah** terdedah di bahagian klien.
2.  **Penghalaan Berasaskan Keadaan (*State-Driven Routing*):** Aplikasi ini menggunakan pembolehubah keadaan (`activeView` dalam `App.tsx`) untuk mengawal komponen mana yang dipaparkan, mengelakkan kerumitan pustaka penghalaan luaran.
3.  **Prestasi Diutamakan:**
    *   **Pemisahan Kod:** `React.lazy()` digunakan untuk memuatkan komponen utama hanya apabila diperlukan.
    *   **Caching Agresif:** Data yang kerap diakses disimpan dalam IndexedDB untuk mengurangkan panggilan rangkaian dan membolehkan fungsi luar talian.
    *   **Memoization:** `React.memo` digunakan untuk komponen senarai seperti `AyahView` bagi mengelakkan render semula yang tidak perlu.

Untuk butiran lanjut, sila rujuk [architecture.md](./architecture.md).

---

## 📂 Struktur Projek Lengkap

```
quranpulse/
├── api/
│   └── index.ts               # Pelayan Proksi Express (Serverless Function)
├── public/
│   ├── data/                  # Fail JSON untuk data statik besar (Iqra', Kisah Nabi, dll.)
│   └── images/
│       └── islamic-pattern.png
├── src/
│   ├── components/
│   │   ├── ui/                # Komponen UI boleh guna semula (Button, Card, Switch, dll.)
│   │   ├── icons/             # Komponen ikon SVG
│   │   ├── *Feature*.tsx      # Komponen ciri utama (QuranReader, PrayerTimes, dll.)
│   ├── context/               # Penyedia konteks React (Audio, Toast, dll.)
│   ├── data/                  # Data statik kecil yang dibundel
│   ├── hooks/                 # Cangkuk React kustom (useQuranData, useAutoplay, dll.)
│   ├── lib/
│   │   ├── agents.ts          # Definisi personaliti dan arahan sistem untuk AI
│   │   └── utils.ts           # Fungsi utiliti umum (cth., cn)
│   ├── services/
│   │   ├── dbService.ts       # Abstraksi untuk interaksi IndexedDB
│   │   └── geminiService.ts   # Klien untuk berkomunikasi dengan proksi backend
│   ├── types.ts               # Definisi jenis TypeScript global
│   ├── App.tsx                # Komponen akar aplikasi (susun atur, penghalaan)
│   └── index.tsx              # Titik masuk aplikasi React
├── .env.example
├── architecture.md
├── index.html
├── metadata.json
├── package.json
├── PROMPT.md
├── README.md                  # Fail ini
├── tsconfig.json
└── vercel.json
```

---

## 🚀 Bagaimana untuk Bermula (Getting Started)

Sila ikuti langkah-langkah ini untuk menjalankan projek secara tempatan.

### Prasyarat
-   Node.js (versi 18 atau lebih baru)
-   npm atau pnpm

### Pemasangan
1.  **Klon repositori ini:**
    ```bash
    git clone https://github.com/your-username/quranpulse.git
    cd quranpulse
    ```

2.  **Pasang kebergantungan:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Pembolehubah Persekitaran:**
    -   Dapatkan kunci API Google Gemini daripada [Google AI Studio](https://makersuite.google.com/app/apikey).
    -   Salin `.env.example` ke `.env` dan isikan kunci API anda:
        ```
        GEMINI_API_KEY=AIzaSy...
        ```

4.  **Jalankan Pelayan Pembangunan:**
    Aplikasi ini menggunakan Vite untuk pelayan pembangunan tempatan yang pantas.
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173`. Pelayan proksi API akan dikendalikan secara automatik.

---

## 📡 Titik Akhir API (Backend Endpoints)

Pelayan proksi di `api/index.ts` menyediakan titik akhir berikut. Semua permintaan adalah `POST`.

-   `/api/generate-content`: Titik akhir umum untuk menjana kandungan teks.
-   `/api/generate-study-plan`: Menjana pelan pembelajaran dalam format JSON.
-   `/api/convert-to-jawi`: Menukar teks Rumi ke Jawi.
-   `/api/generate-speech`: Menukar teks kepada audio (TTS).
-   `/api/tajweed-feedback`: Menganalisis transkrip bacaan untuk maklum balas tajwid.
-   `/api/edit-image`: Mengedit imej berdasarkan prom teks.
-   `/api/create-payment`: (Simulasi) Mencipta sesi pembayaran untuk pembelian dalam aplikasi.

---

## ⚖️ Etika & Pematuhan Syariah

QuranPulse komited untuk menyediakan kandungan yang sahih dan boleh dipercayai, selaras dengan pegangan **Ahli Sunnah Wal Jamaah** dan **Mazhab Syafi'i**.

### 📚 Sumber Rujukan Utama
Semua kandungan AI berpandukan sumber-sumber rasmi Malaysia, termasuk:
-   **JAKIM:** `islam.gov.my`
-   **MyHadith:** `myhadith.islam.gov.my`
-   **e-Fatwa:** `e-fatwa.gov.my`
-   **i-Fiqh:** `i-fiqh.islam.gov.my`
-   Dan portal rasmi lain di bawah seliaan JAKIM.

### 🛡️ Prinsip Etika AI
-   **Ketelusan:** Pengguna sentiasa dimaklumkan apabila berinteraksi dengan AI.
-   **Keselamatan:** AI **dilarang sama sekali** daripada mengeluarkan fatwa.
-   **Privasi:** Rakaman audio untuk analisis Tajwid tidak disimpan di pelayan.

> **Penafian:** Ciri AI adalah alat bantuan pembelajaran dan bukan pengganti nasihat daripada ulama yang bertauliah.

---

### 🛣️ Hala Tuju Masa Depan

-   **Paparan AR Qiblat**: Melaksanakan ciri Realiti Terimbuh (AR) untuk kompas qiblat.
-   **Mod Hafazan**: Ciri khusus untuk membantu pengguna menghafal Al-Quran.
-   **Ciri Sosial Lanjutan**: Membolehkan pengguna menambah rakan dan membentuk kumpulan belajar.
-   **Aplikasi Mudah Alih Asli**: Membangunkan aplikasi iOS dan Android untuk prestasi yang lebih baik.

---

## 📜 License

Projek ini dilesenkan di bawah [MIT License](LICENSE).

---

## 🙏 Credits & Acknowledgments

-   **Kandungan Islamik:** Tanzil Project, Tafsir Pimpinan Ar-Rahman, Sheikh Mishary Rashid Alafasy.
-   **Sumber Rasmi:** JAKIM, Majlis Fatwa Kebangsaan, dan agensi berkaitan.
-   **Teknologi:** Google (untuk model Gemini), Pasukan React, Pasukan TypeScript, Tailwind Labs.

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

Dibuat dengan ❤️ untuk Ummah

</div>
