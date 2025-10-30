export interface MushafPage {
  page: number;
  juz: number;
  surah_starts: { [surahNumber: number]: string };
  lines: string[];
}

// Data for first 2 pages of a standard 15-line Mushaf.
// Ayah markers (e.g., ۝١) are included in the strings.
export const mushafData: MushafPage[] = [
  // Page 1: Surah Al-Fatihah
  {
    page: 1,
    juz: 1,
    surah_starts: { 1: "سُورَةُ ٱلْفَاتِحَةِ" },
    lines: [
      "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝١",
      "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ ۝٢",
      "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝٣",
      "مَٰلِكِ يَوْمِ ٱلدِّينِ ۝٤",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥",
      "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝٦",
      "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ",
      "عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ۝٧",
       "", "", "", "", "", "", "" // Fill to 15 lines
    ]
  },
  // Page 2: Start of Surah Al-Baqarah
  {
    page: 2,
    juz: 1,
    surah_starts: { 2: "سُورَةُ البَقَرَةِ" },
    lines: [
      "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "الٓمٓ ۝١",
      "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ۝٢",
      "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا",
      "رَزَقْنَٰهُمْ يُنفِقُونَ ۝٣",
      "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن",
      "قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ ۝٤",
      "أُوْلَٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُوْلَٰٓئِكَ هُمُ",
      "ٱلْمُفْلِحُونَ ۝٥",
      "", "", "", "", "", ""
    ]
  },
];

export const TOTAL_MUSHAF_PAGES = 604;

export const getMushafPageData = (page: number): MushafPage | undefined => {
    return mushafData.find(p => p.page === page);
}
