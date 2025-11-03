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

export const tajweedRulesData: TajweedRule[] = [
  {
    id: 'qalqalah',
    name: 'Qalqalah',
    arabic: 'القَلْقَلَةُ',
    description: 'Qalqalah bermaksud "lantunan" atau "getaran". Ia adalah sebutan yang melantun pada 5 huruf tertentu apabila ia mati (bertanda sukun) atau diwaqafkan (diberhentikan).',
    howToRead: "Huruf-huruf Qalqalah adalah ق (Qaf), ط (Ta'), ب (Ba'), ج (Jim), د (Dal). Apabila salah satu huruf ini sukun, sebutkan ia dengan lantunan yang jelas tanpa menambah vokal tambahan.",
    examples: [
      { arabic: 'يَجْعَلُ', transliteration: 'yaj-\'alu', explanation: 'Qalqalah Sughra (kecil) kerana ج sukun di tengah kalimah.' },
      { arabic: 'الْفَلَقِ ⇦ الْفَلَقْ', transliteration: 'al-falaq', explanation: 'Qalqalah Kubra (besar) kerana waqaf pada huruf ق di akhir ayat.' },
    ],
  },
  {
    id: 'ghunnah',
    name: 'Ghunnah',
    arabic: 'الغُنَّةُ',
    description: 'Ghunnah ialah bunyi dengung yang keluar dari pangkal hidung. Ia berlaku pada huruf ن (Nun) dan م (Mim) yang bertanda sabdu (tasydid).',
    howToRead: "Apabila bertemu نّ (Nun musyaddadah) atau مّ (Mim musyaddadah), tahan bacaan pada huruf tersebut selama 2 harakat sambil mengeluarkan bunyi dengung dari hidung.",
    examples: [
      { arabic: 'إِنَّ', transliteration: 'inna', explanation: 'Dengung pada huruf نّ selama 2 harakat.' },
      { arabic: 'ثُمَّ', transliteration: 'thumma', explanation: 'Dengung pada huruf مّ selama 2 harakat.' },
    ],
  },
  {
    id: 'madd',
    name: 'Madd Asli',
    arabic: 'المد الأصلي',
    description: 'Madd Asli (atau Madd Tabii) ialah bacaan panjang asas dalam Al-Quran. Ia berlaku apabila huruf berbaris fathah bertemu alif (ا), kasrah bertemu ya sukun (يْ), atau dammah bertemu waw sukun (وْ).',
    howToRead: "Panjangkan bacaan pada huruf tersebut sebanyak 2 harakat (ketukan).",
    examples: [
      { arabic: 'قَالَ', transliteration: 'qāla', explanation: 'Fathah pada ق bertemu Alif.' },
      { arabic: 'قِيْلَ', transliteration: 'qīla', explanation: 'Kasrah pada ق bertemu Ya sukun.' },
      { arabic: 'يَقُوْلُ', transliteration: 'yaqūlu', explanation: 'Dammah pada ق bertemu Waw sukun.' },
    ],
  },
    {
    id: 'izhar',
    name: 'Izhar Halqi',
    arabic: 'الإظهار الحلقي',
    description: "Izhar bermaksud 'jelas' atau 'nyata'. Ia berlaku apabila Nun mati (نْ) atau tanwin (ــًــٍــٌ) bertemu dengan salah satu daripada 6 huruf kerongkong (halq).",
    howToRead: "Bunyi Nun mati atau tanwin dibaca dengan jelas tanpa dengung. Huruf-huruf Izhar Halqi adalah ء, ه, ع, ح, غ, خ.",
    examples: [
      { arabic: 'مِنْ خَوْفٍ', transliteration: 'min khawf', explanation: 'Nun mati bertemu huruf خ.' },
      { arabic: 'عَذَابٌ أَلِيمٌ', transliteration: 'ʿadhābun alīm', explanation: 'Tanwin pada ب bertemu huruf ء.' },
    ],
  },
  {
    id: 'ikhfa',
    name: "Ikhfa' Haqiqi",
    arabic: 'الإخفاء الحقيقي',
    description: "Ikhfa' bermaksud 'menyembunyikan'. Ia berlaku apabila Nun mati (نْ) atau tanwin bertemu dengan salah satu daripada 15 huruf Ikhfa'.",
    howToRead: "Bunyi Nun mati atau tanwin dibaca secara samar-samar antara Izhar dan Idgham, disertai dengan dengung ringan selama 2 harakat. Huruf-huruf Ikhfa' adalah ت, ث, ج, د, ذ, ز, س, ش, ص, ض, ط, ظ, ف, ق, ك.",
    examples: [
      { arabic: 'أَنْفُسَكُمْ', transliteration: 'anfusakum', explanation: 'Nun mati bertemu huruf ف.' },
      { arabic: 'رَجُلًا سَلَمًا', transliteration: 'rajulan salaman', explanation: 'Tanwin pada ل bertemu huruf س.' },
    ],
  },
];