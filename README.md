# 🕌 QuranPulse: Al-Quran SuperApp untuk Malaysia

QuranPulse ialah sebuah aplikasi super Al-Quran yang canggih dan boleh dipercayai, direka khusus untuk komuniti Muslim di Malaysia. Aplikasi ini menggabungkan alatan ibadah harian yang penting dengan ciri-ciri pembelajaran termaju yang dikuasakan oleh Google Gemini, semuanya dibentangkan dalam antara muka pengguna yang minimalis, beretika, dan mesra pengguna.

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

*   **Pembaca Al-Quran:** Baca Al-Quran dalam dua mod paparan: **Mod Senarai** tradisional atau **Mod Mushaf** yang menyerupai halaman fizikal Al-Quran. Lengkap dengan teks Uthmani yang jelas.
*   **Audio Murattal & Autoplay:** Dengar bacaan ayat demi ayat daripada qari terkenal (Mishary Rashid Alafasy). Ciri **"Mainkan Semua"** membolehkan pendengaran surah secara berterusan tanpa gangguan.
*   **Terjemahan & Transliterasi:** Terjemahan dalam Bahasa Melayu (Tafsir Pimpinan Ar-Rahman) dan Bahasa Inggeris (Sahih International). Paparan transliterasi Rumi yang dinaik taraf dengan tanda diakritik akademik (cth., `ā`, `ṣ`, `ḥ`) untuk sebutan yang lebih tepat.
*   **Waktu Solat:** Dapatkan waktu solat yang tepat untuk bandar-bandar utama di seluruh Malaysia.
*   **Kompas Qiblat:** Cari arah Qiblat dengan mudah menggunakan penderia peranti anda, lengkap dengan permintaan kebenaran untuk peranti iOS.
*   **Asmaul Husna:** Terokai 99 Nama Allah dengan tulisan Arab, transliterasi, terjemahan, dan fungsi carian. Dengar sebutan yang betul untuk setiap nama melalui penjanaan audio AI.
*   **Penjejak Ibadah:** Pantau dan jejak amalan harian anda. Data disimpan secara setempat (*local storage*) untuk kesinambungan.
*   **Doa & Zikir:** Akses koleksi doa masnun dan zikir harian yang dilengkapi dengan pembilang digital interaktif.

### 🧠 Alatan Pembelajaran Dikuasakan AI (Google Gemini)

*   **Sobat AI Cerdas (`AICompanion.tsx`):**
    *   **Agen Navigasi:** Memahami arahan bahasa tabii untuk menavigasi aplikasi (cth., "Tunjukkan waktu solat," "Buka Surah Yasin").
    *   **Pengetahuan Aplikasi:** Mempunyai pengetahuan mendalam tentang ciri aplikasi, termasuk kurikulum Iqra' dan hukum Tajwid asas seperti Qalqalah, untuk memberikan cadangan yang relevan.
    *   **Grounding Peta Google:** Menjawab soalan berasaskan lokasi (cth., "Cari masjid berdekatan") dengan data masa nyata dari Peta Google.
    *   **Penjanaan Imej:** Menghasilkan gambar rajah dan visual (cth., carta langkah wuduk) untuk membantu pemahaman.
    *   **Penukaran Mod:** Boleh bertukar ke mod "Ustaz AI" untuk soalan yang lebih formal.

*   **Tanya Ustaz (`TanyaUstaz.tsx`):**
    *   **Jawapan Berautoriti:** Mod soal jawab formal yang menjawab soalan feqah secara eksklusif daripada sumber berautoriti Malaysia (Al-Quran, Tafsir Pimpinan Ar-Rahman, MyHadith, e-Fatwa JAKIM).
    *   **Petikan Sumber:** Setiap jawapan disertakan dengan petikan sumber yang jelas untuk kebolehpercayaan.
    *   **Streaming & Audio:** Jawapan distrim dalam masa nyata dan boleh didengar melalui audio (teks-ke-ucapan).

*   **Tutor Tajwid AI (PRO) (`TajweedTutor.tsx`):**
    *   **Maklum Balas Masa Nyata:** Menggunakan Gemini Live API untuk mendengar bacaan pengguna (Iqra' atau Al-Quran) dan memberikan maklum balas sebutan (makhraj & harakat) serta skor ketepatan.
    *   **Penyerlahan Perkataan:** Menyerlahkan perkataan dalam teks Iqra' yang memerlukan penambahbaikan berdasarkan maklum balas AI.

*   **Pelan Pembelajaran AI (`StudyPlanner.tsx`):** Rangka jadual pembelajaran atau hafazan Al-Quran yang diperibadikan berdasarkan matlamat, tempoh, dan tahap semasa pengguna.

*   **Sembang Suara AI (PRO) (`LiveConversation.tsx`):** Sesi perbualan suara interaktif dengan AI dalam Bahasa Melayu, dikuasakan oleh Gemini Live API untuk latensi rendah.

*   **Penulis Jawi AI (`JawiWriter.tsx`):** Tukar teks Rumi ke tulisan Jawi dengan serta-merta.

*   **Penjelasan Ayat AI (`QuranReader.tsx`):** Dapatkan penjelasan ringkas dan mudah difahami untuk mana-mana ayat Al-Quran dengan satu klik.

---

## 🚀 Timbunan Teknologi (Technology Stack)

### Frontend
*   **Framework:** React 19 (dimuat melalui CDN menggunakan *import maps*)
*   **Bahasa:** TypeScript
*   **Styling:** Tailwind CSS (dikonfigurasi secara terus dalam HTML)
*   **Struktur:** Aplikasi Halaman Tunggal (*Single Page Application*) tanpa langkah binaan (*build step*). Navigasi dikendalikan oleh state management (`activeView`) dalam komponen `App.tsx`.
*   **State Management:** React Context API & Hooks
*   **Icons:** Komponen SVG kustom dalam `components/icons/Icons.tsx`

### Kecerdasan Buatan (AI)
*   **Provider:** Google Gemini API (`@google/genai`)
*   **Model Digunakan:**
    *   `gemini-2.5-pro`: Untuk `TanyaUstaz` yang memerlukan penaakulan mendalam dan rujukan.
    *   `gemini-2.5-flash`: Untuk `AICompanion`, penjelasan ayat, pelan pembelajaran, dan penulisan Jawi.
    *   `gemini-2.5-flash-image`: Untuk penjanaan imej dalam `AICompanion`.
    *   `gemini-2.5-flash-native-audio-preview-09-2025`: (Live API) Untuk `TajweedTutor` dan `LiveConversation`.
    *   `gemini-2.5-flash-preview-tts`: Untuk semua keperluan Teks-ke-Ucapan.

### API & Sumber Data
*   **Teks Al-Quran & Terjemahan:** `api.alquran.cloud`
*   **Audio Bacaan:** `everyayah.com`
*   **Waktu Solat:** `api.aladhan.com` (sebagai proksi untuk data e-Solat JAKIM)
*   **Data Iqra':** `public/data/iqraData.json` (dimuat secara dinamik)
*   **Data Asmaul Husna:** `data/asmaulHusnaData.ts` (data statik)

### Storan & API Pelayar
*   **IndexedDB:** Untuk caching data aplikasi (mesej sembang, pelan belajar, sesi tajwid, data Iqra').
*   **Local Storage:** Untuk menyimpan progres ringkas seperti penjejak ibadah dan halaman Iqra' semasa.
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
│       └── iqraData.json      # Data statik Iqra' (dioptimumkan untuk prestasi)
│
├── src/
│   ├── components/
│   │   ├── ui/                  # Komponen UI boleh guna semula (Button, Card, etc.)
│   │   ├── icons/               # Komponen ikon SVG
│   │   ├── AICompanion.tsx      # Ciri utama Sobat AI Cerdas
│   │   ├── AsmaulHusna.tsx      # Paparan 99 Nama Allah
│   │   ├── GlobalAudioPlayer.tsx# Pemain audio global di header
│   │   ├── IqraBookView.tsx     # Antara muka pembelajaran Iqra'
│   │   ├── LiveConversation.tsx # Ciri Sembang Suara AI
│   │   ├── QuranReader.tsx      # Komponen utama pembaca Al-Quran
│   │   ├── Sidebar.tsx          # Bar sisi navigasi utama
│   │   ├── TajweedCoach.tsx     # Antara muka maklum balas bacaan AI
│   │   ├── TajweedTutor.tsx     # Komponen induk untuk Tutor Tajwid
│   │   ├── TanyaUstaz.tsx       # Ciri soal jawab formal dengan Ustaz AI
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
│   │   └── useQuranData.ts      # Logik untuk memuatkan data surah
│   │
│   ├── services/
│   │   ├── dbService.ts         # Interaksi dengan IndexedDB
│   │   ├── geminiService.ts     # Klien API Google Gemini
│   │   └── transliterationConverter.ts # Logik penukaran transliterasi
│   │
│   ├── utils/
│   │   └── audio.ts             # Fungsi bantuan pemprosesan audio
│   │
│   ├── App.tsx                  # Komponen akar aplikasi, menguruskan routing & layout
│   ├── index.tsx                # Titik masukan aplikasi
│   ├── types.ts                 # Definisi jenis TypeScript global
│   └── ...
│
├── index.html                   # Fail HTML utama dengan import maps
├── README.md                    # Dokumentasi ini
└── TODO.md                      # Pelan pengoptimuman (telah selesai)
```

---

## ⚡ Pengoptimuman Prestasi

Aplikasi ini telah melalui beberapa fasa pengoptimuman yang ketara:

- **Pemisahan Kod (*Code Splitting*):** Komponen-komponen utama dimuat secara dinamik menggunakan `React.lazy()` dan `Suspense`. Ini mengurangkan saiz muatan awal dengan ketara, membolehkan aplikasi dipaparkan lebih cepat.
- **Pemuatan Data Statik:** Data Iqra' yang besar telah dipindahkan dari bundle JavaScript ke fail JSON statik yang dimuat apabila diperlukan, mengurangkan saiz JS awal.
- **Caching Lanjutan:** Data Iqra' yang telah dimuat turun akan disimpan dalam IndexedDB. Pada lawatan seterusnya, data dimuat serta-merta dari cache, membolehkan akses luar talian sepenuhnya untuk ciri Iqra'.
- **Pengurangan Panggilan API:** Penjelasan ayat Al-Quran disimpan dalam cache IndexedDB. Logik main balik audio untuk Iqra' juga menggunakan cache untuk mengelakkan panggilan Teks-ke-Ucapan berulang untuk baris yang sama.
- **Memoization Komponen:** Komponen dalam senarai panjang seperti `AyahView` menggunakan `React.memo` untuk mengelakkan render semula yang tidak perlu, memastikan antara muka kekal responsif.
- **Penyusunan Semula Kod (*Refactoring*):** Komponen kompleks seperti `QuranReader` telah disusun semula menggunakan cangkuk (*hooks*) kustom (`useQuranData`, `useAutoplay`) untuk memisahkan logik dan menjadikan kod lebih bersih dan mudah diselenggara.
- **Utiliti Berpusat:** Fungsi bantuan yang dikongsi (cth., pemprosesan audio) telah dipusatkan dalam direktori `utils/` untuk mengelakkan pertindihan kod.

---

## ⚙️ Konfigurasi

### Kunci API Google Gemini

Aplikasi ini memerlukan kunci API Google Gemini untuk berfungsi. Kunci ini dijangka akan disediakan oleh persekitaran pelaksanaan (*execution environment*) melalui pembolehubah persekitaran `process.env.API_KEY`. **Tidak perlu** mengkonfigurasi fail `.env` atau memasukkan kunci API secara manual dalam kod.

### Kebenaran Pelayar

Aplikasi akan meminta kebenaran berikut apabila diperlukan:

- **🎤 Mikrofon:** Diperlukan untuk *Tutor Tajwid AI* dan *Sembang Suara AI*.
- **📍 Lokasi (Geolocation):** Diperlukan untuk *Waktu Solat* dan *Kompas Qiblat*.
- **🧭 Penderia Orientasi Peranti:** Diperlukan untuk *Kompas Qiblat*.

---

## ⚖️ Etika & Sumber Data

QuranPulse komited untuk menyediakan kandungan yang beretika dan boleh dipercayai.

### 📚 Sumber Data Berautoriti

Ciri-ciri AI seperti `TanyaUstaz` diprogramkan secara khusus untuk merujuk **HANYA** kepada sumber-sumber yang diiktiraf di Malaysia:
1.  **Al-Quran Al-Karim** & **Tafsir Pimpinan Ar-Rahman**
2.  **MyHadith** (pangkalan data hadis rasmi JAKIM)
3.  **Portal e-Fatwa JAKIM**

### 🛡️ Prinsip Etika AI

- **Ketelusan:** Pengguna sentiasa dimaklumkan apabila mereka berinteraksi dengan AI, dan batasan AI dijelaskan.
- **Ketepatan:** Arahan sistem (*system prompts*) yang ketat digunakan untuk memastikan AI berpegang pada sumber data yang ditetapkan dan memetik rujukannya.
- **Keselamatan:** AI dilarang sama sekali daripada mengeluarkan fatwa, menjawab soalan akidah yang kontroversi, atau menggantikan peranan ulama bertauliah.
- **Privasi:** Rakaman audio untuk analisis Tajwid tidak disimpan. Data peribadi tidak dikumpul.

> **Penafian:** Semua ciri AI adalah alat bantuan pembelajaran dan bukan pengganti nasihat daripada alim ulama yang bertauliah. Untuk isu-isu fiqh yang kompleks, sila rujuk kepada ustaz atau mufti yang berkelayakan.

---

## 📜 License

Projek ini dilesenkan di bawah [MIT License](LICENSE). Anda bebas untuk menggunakan, mengubah suai, dan mengedarkan kod ini untuk tujuan peribadi atau komersial, dengan syarat notis hak cipta dan lesen disertakan.

---

## 🙏 Credits & Acknowledgments

- **Kandungan Islamik:** Tanzil Project, Tafsir Pimpinan Ar-Rahman, Sahih International, Sheikh Mishary Rashid Alafasy.
- **Sumber Rasmi:** JAKIM (e-Solat, e-Fatwa), MyHadith.
- **Teknologi:** Google (untuk model Gemini), Pasukan React, Pasukan TypeScript, Tailwind Labs.
- **Pembangun & Komuniti:** Semua penyumbang sumber terbuka yang menjadikan projek ini mungkin.

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

Dibuat dengan ❤️ untuk Ummah

**QuranPulse** - Teman Harian Anda untuk Pertumbuhan Rohani

</div>
