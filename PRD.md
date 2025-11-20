# 🕌 Dokumen Keperluan Produk (PRD): QuranPulse SuperApp

**Versi**: 2.0
**Tarikh**: 26 Oktober 2025
**Pemilik Produk**: [Nama Anda/Ketua Produk]
**Status**: Aktif

---

## 1.0 📊 Pengenalan & Visi Produk

**QuranPulse** ialah sebuah Aplikasi Super Al-Quran yang canggih, beretika, dan boleh dipercayai, direka khusus untuk komuniti Muslim di Malaysia.

**Visi kami** adalah untuk menjadi teman harian yang memperkasakan pertumbuhan rohani dan intelektual setiap Muslim di Malaysia, dengan menggabungkan alatan ibadah teras dengan teknologi AI termaju dalam satu pengalaman yang lancar, peribadi, dan memotivasi.

Aplikasi ini menyelesaikan masalah utama pengguna Muslim moden: kesukaran untuk mengakses alatan pembelajaran Islam yang mendalam, berstruktur, dan boleh dipercayai dalam satu platform yang mudah digunakan, terutamanya bagi mereka yang sibuk dan sentiasa bergerak. QuranPulse menangani jurang ini dengan menyediakan ekosistem pembelajaran dan ibadah yang bersepadu, disokong oleh reka bentuk yang moden dan gamifikasi yang menarik.

---

## 2.0 🎯 Matlamat & Objektif Perniagaan

Matlamat utama QuranPulse adalah untuk menjadi aplikasi Islamik pilihan utama di Malaysia melalui penglibatan dan pengekalan pengguna yang tinggi.

| Objektif                                        | Metrik Utama (Key Metrics)                                       | Sasaran (12 Bulan)       |
| ----------------------------------------------- | ---------------------------------------------------------------- | ------------------------ |
| 📈 **Meningkatkan Penglibatan Pengguna**        | DAU/MAU Ratio, Purata Tempoh Sesi, Kekerapan Sesi                | DAU/MAU > 30%            |
| 📚 **Memperdalam Pembelajaran Pengguna**       | Kadar Penyiapan Laluan Pembelajaran, Penggunaan Ciri AI, Kadar Hafazan | +25% Penggunaan Ciri PRO |
| 🏆 **Meningkatkan Pengekalan Pengguna**         | Kadar Pengekalan (Retention Rate) Hari ke-30, Kadar Churn        | Kadar Pengekalan D30 > 40% |
| 🇲🇾 **Menguasai Pasaran Malaysia**               | Bilangan Muat Turun, Kedudukan App Store, Liputan Media          | Top 3 dalam kategori     |
| 💰 **Menguji Model Monetisasi Freemium**       | Kadar Penukaran PRO, Jualan Pek Permata (simulasi)               | Kadar Penukaran > 2%     |

---

## 3.0 🧑‍🤝‍🧑 Sasaran Pengguna & Persona

Kami menyasarkan tiga segmen utama dalam komuniti Muslim Malaysia:

1.  **"Pelajar Muda Digital" (16-25 tahun)**
    *   **Latar Belakang**: Pelajar universiti atau graduan baru, celik teknologi, aktif di media sosial.
    *   **Matlamat**: Ingin belajar agama dengan cara yang moden dan interaktif. Suka gamifikasi dan bersaing dengan rakan-rakan.
    *   **Ciri Pilihan**: `LearningPath`, `Leaderboard`, `TajweedTutor`, `AICompanion`, `InteractiveLesson`, `Achievements`.

2.  **"Profesional Sibuk" (26-45 tahun)**
    *   **Latar Belakang**: Bekerja sepenuh masa, berkeluarga, mempunyai masa terhad.
    *   **Matlamat**: Memerlukan alatan yang cekap untuk mengekalkan amalan harian seperti membaca Al-Quran dan solat tepat pada masanya.
    *   **Ciri Pilihan**: **`PrayerTimes` (dengan notifikasi WhatsApp)**, `QuranReader` (dengan autoplay), `IbadahTracker`, `DailyQuoteView`, `TasbihDigital`.

3.  **"Pencari Ilmu Matang" (46+ tahun)**
    *   **Latar Belakang**: Lebih berusia, mungkin kurang mahir teknologi tetapi mempunyai keinginan mendalam untuk ilmu.
    *   **Matlamat**: Mencari jawapan kepada soalan-soalan agama yang mendalam dan mengakses kandungan Islamik yang sahih.
    *   **Ciri Pilihan**: `TanyaUstaz`, `TafsirView`, `KisahNabiView`, `ArtikelIslamiView`, `SirahNabawiyahView`, `PanduanIbadahView`.

---

## 4.0 ✨ Ciri-Ciri & Keperluan Fungsian

### 4.1 🕋 Teras Ibadah Harian

| Ciri                | Keperluan Fungsian                                                                                                                                                       | Kebergantungan Teknikal                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| **Pembaca Al-Quran**    | - Paparan teks Uthmani yang jelas.<br>- Terjemahan (Melayu, Inggeris, Transliterasi) dengan suis on/off.<br>- Main audio Murattal per ayat.<br>- Ciri Autoplay dengan kawalan kelajuan (0.75x, 1x, 1.25x, 1.5x).<br>- Sorotan ayat aktif semasa autoplay. | `useQuranData` (API), `useAutoplay`, `AudioContext` |
| **Waktu Solat**         | - Paparan waktu solat untuk bandar-bandar utama di Malaysia.<br>- Kemas kini masa nyata.<br>- **Pemberitahuan WhatsApp eksperimental** yang boleh disesuaikan sebelum waktu solat. | Geolocation API, `api.aladhan.com`, `localStorage`  |
| **Arah Qiblat**         | - Kompas masa nyata menunjukkan arah Qiblat.<br>- Menggunakan sensor peranti & geolokasi.<br>- **Ciri kalibrasi dengan panduan gerakan "angka lapan".**                     | Geolocation API, Device Orientation API             |
| **Penjejak Ibadah**     | - Senarai amalan harian (solat, zikir, dll.).<br>- Pengguna boleh menanda amalan yang selesai **(UI suis Neo-Brutalism)**.<br>- Progres disimpan setiap hari dalam `localStorage`.                     | `localStorage`                                      |
| **Doa & Zikir**         | - Koleksi doa harian dan zikir popular.<br>- Pembilang digital interaktif untuk setiap zikir.<br>- Progres disimpan secara berterusan.                             | `localStorage`, `DoaTrackerContext`                 |

### 4.2 🧠 Alatan Pembelajaran AI (PRO)

| Ciri                 | Keperluan Fungsian                                                                                                                                                 | Model AI Utama                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| **Sobat AI Cerdas**      | - Antara muka sembang umum untuk menjawab pelbagai soalan.<br>- Sejarah perbualan disimpan dalam IndexedDB dan boleh diakses semula.                                                  | `gemini-2.5-flash`                               |
| **Tanya Ustaz**          | - Sembang khusus untuk soalan Fiqh.<br>- Sistem arahan AI menekankan rujukan kepada sumber berautoriti Malaysia.<br>- Mempunyai mod "Pakar Fiqh" untuk jawapan mendalam. | `gemini-2.5-pro` (dengan arahan sistem ketat) |
| **Tutor Tajwid**         | - Analisis sebutan ayat Al-Quran atau Iqra' menggunakan mikrofon.<br>- Memberi skor ketepatan dan maklum balas terperinci.<br>- Sejarah sesi latihan disimpan dalam IndexedDB.          | `gemini-2.5-pro` (analisis audio-ke-teks)        |
| **Pelan Belajar**        | - Menjana pelan pembelajaran berstruktur (harian) berdasarkan matlamat, tempoh, dan tahap pengguna.<br>- Hasil dalam format JSON yang mudah dipaparkan.            | `gemini-2.5-flash` / `gemini-2.5-pro`              |
| **Penulis Jawi**         | - Menukar teks Rumi ke Jawi secara masa nyata.<br>- Sejarah penukaran disimpan dalam IndexedDB.                                                                                                                   | `gemini-2.5-flash`                               |
| **Sembang Suara**        | - Perbualan suara masa nyata dengan AI dalam Bahasa Melayu.<br>- Memaparkan transkrip perbualan secara langsung.                                                    | `gemini-2.5-flash-native-audio-preview-09-2025`  |
| **Editor Imej AI**       | - Memuat naik imej dan memberikan prom teks untuk suntingan.<br>- Menjana imej baru berdasarkan prom.<br>- Menyokong muat turun imej yang telah dijana.                 | `gemini-2.5-flash-image`                         |
| **Tafsir AI** (dalam QuranReader) | - Menjana penjelasan ringkas atau mendalam untuk mana-mana ayat Al-Quran.<br>- Menyimpan penjelasan yang dijana dalam IndexedDB untuk akses luar talian.                        | `gemini-2.5-flash` / `gemini-2.5-pro`              |

### 4.3 🏆 Gamifikasi & Motivasi

| Ciri                  | Keperluan Fungsian                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Laluan Pembelajaran** | - Peta pembelajaran berstruktur visual dari unit asas ke lanjutan.<br>- Pelajaran hanya boleh diakses selepas pelajaran sebelumnya selesai.               |
| **Matlamat Harian**   | - Sasaran XP harian yang boleh disesuaikan.<br>- Tugasan khusus harian untuk ganjaran tambahan (XP & Permata).                                               |
| **Papan Markah**        | - Papan markah mingguan (Rakan, Tempatan, Global).<br>- **Reka letak podium Neo-Brutalism untuk 3 teratas.**<br>- Sistem liga (Bronze, Silver, Gold, etc.).                        |
| **Pencapaian**        | - Lencana yang boleh dibuka berdasarkan kategori (pembelajaran, sosial, milestone).<br>- Paparan progres untuk lencana yang belum dibuka.                  |
| **Kedai Permata**         | - Kedai dalam aplikasi untuk membeli item (power-ups, kosmetik) menggunakan permata.<br>- **Simulasi pembelian pek permata** melalui modal pembayaran selamat. |
| **Pelajaran Interaktif**| - Sesi kuiz pelbagai jenis soalan (aneka pilihan, isi tempat kosong, audio).<br>- Sistem nyawa (hati) dan ganjaran XP.                                       |

### 4.4 📚 Kandungan Tambahan

-   **Asmaul Husna**: Senarai 99 Nama Allah dengan terjemahan, transliterasi, dan sebutan audio.
-   **Kisah Nabi & Sirah Nabawiyah**: Koleksi cerita interaktif dengan imej dan video YouTube terbenam.
-   **Panduan Ibadah**: Panduan langkah demi langkah untuk wuduk, solat, dll.
-   **Tasbih Digital**: Pembilang zikir digital dengan sasaran yang boleh disesuaikan.
-   **Kalendar Hijriyah**: Paparan kalendar bulanan dengan tarikh Gregorian dan Hijriyah.
-   **Artikel Islami**: Koleksi artikel untuk bacaan santai.
-   **Penyemak Halal (AI)**: Alat untuk mendapatkan maklumat awal tentang status Halal bahan makanan.
-   **Petikan Harian**: Paparan petikan inspirasi daripada Al-Quran dan Hadith.

---

### 5.0 🎨 Reka Bentuk & Pengalaman Pengguna (UX)

-   **Prinsip Reka Bentuk**: **Neo-Brutalisme Moden**. Menekankan fungsi mentah dengan warna berani, kontras tinggi, sempadan hitam tebal (2-4px), dan bayang-bayang jatuh yang keras.
-   **Palet Warna**:
    -   **Mod Terang**: Latar belakang putih pudar, primer biru terang, aksen kuning terang.
    -   **Mod Gelap**: Latar belakang kelabu gelap, primer hijau limau, aksen magenta.
-   **Tipografi**: `Inter` untuk teks UI, `Amiri Quran` untuk teks Arab.
-   **Kebolehcapaian (Accessibility)**: Sasaran WCAG 2.1 Tahap AA. Kontras warna yang mencukupi, saiz fon boleh dibaca.
-   **Interaksi**:
    -   Butang mempunyai kesan "tekan" fizikal pada `active`.
    -   Tiada gradien; warna pepejal diutamakan.
    -   Susun atur sedikit tidak simetri untuk estetika "tidak direka".

---

### 6.0 🚀 Keperluan Teknikal

-   **Frontend**: **React 19**, TypeScript, Tailwind CSS. Dijalankan tanpa langkah binaan (*build-step*) menggunakan `import maps`.
-   **Backend (Proxy)**: Fungsi Tanpa Pelayan (Serverless Function) di Vercel, menggunakan Express.js.
-   **Storan Klien**: **IndexedDB** untuk caching data API dan kandungan (pelan belajar, sejarah sembang, tafsir), **LocalStorage** untuk tetapan pengguna dan progres ringkas.
-   **Prestasi**:
    -   **Pemisahan Kod**: Semua komponen ciri utama dimuatkan secara malas (`React.lazy`).
    -   **Sasaran TTI (Time to Interactive)**: < 3 saat pada sambungan 3G.
-   **Keselamatan**:
    -   Kunci API Gemini **WAJIB** berada di pelayan sahaja. Tiada kunci API dalam kod klien.
    -   Semua permintaan AI melalui proksi `/api/` yang mempunyai had kadar (rate limiting).
-   **Sumber Data**: `api.alquran.cloud` (Quran), `everyayah.com` (Audio), `api.aladhan.com` (Waktu Solat). Data statik (Iqra', senarai surah) difailkan secara tempatan untuk akses luar talian.

---

### 7.0 ⚖️ Etika & Pematuhan (Compliance)

Ini adalah tonggak utama QuranPulse.

-   **Sumber Berautoriti**: Ciri `TanyaUstaz` diprogramkan untuk memberi keutamaan kepada sumber rujukan yang diiktiraf di Malaysia (JAKIM, e-Fatwa, MyHadith).
-   **Tiada Fatwa oleh AI**: AI dilarang sama sekali daripada mengeluarkan fatwa. Ia akan sentiasa menasihati pengguna untuk merujuk kepada ulama bertauliah untuk isu-isu kompleks.
-   **Ketelusan AI**: Pengguna sentiasa dimaklumkan dengan jelas apabila mereka berinteraksi dengan ciri AI, termasuk model yang digunakan (cth., "Ustaz AI (Gemini Pro)").
-   **Privasi Pengguna**: Rakaman audio untuk `TajweedTutor` dan `LiveConversation` tidak disimpan di pelayan. Data diproses dan dibuang.

---

### 8.0 📈 Skop Masa Depan & Hala Tuju

-   **Paparan AR Qiblat**: Melaksanakan ciri Realiti Terimbuh (Augmented Reality) untuk kompas qiblat.
-   **Mod Hafazan**: Ciri khusus untuk membantu pengguna menghafal Al-Quran dengan ujian dan penjejakan.
-   **Ciri Sosial**: Membolehkan pengguna menambah rakan, membentuk kumpulan belajar, dan berkongsi progres.
-   **Pemperibadian Lanjutan**: Laluan pembelajaran yang dijana oleh AI secara dinamik berdasarkan prestasi pengguna.
-   **Aplikasi Mudah Alih Asli**: Membangunkan aplikasi iOS dan Android untuk prestasi yang lebih baik dan pemberitahuan tolak (push notifications).
