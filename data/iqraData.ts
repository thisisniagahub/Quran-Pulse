export interface IqraPage {
  book: number;
  page: number;
  lines: string[];
  title?: string;
  description?: string;
  category?: 'cover' | 'intro' | 'lesson' | 'exercise' | 'review';
}

export const iqraData: IqraPage[] = [
  // ==========================================
  // IQRA 1: Pengenalan Huruf Hijaiyah (47 halaman)
  // ==========================================
  
  // Cover & Intro
  { book: 1, page: 1, category: 'cover', title: "Cover Iqra 1", lines: ["إِقْرَأْ ١", "Cara Cepat Belajar Membaca Al-Qur'an"], description: "Cover buku Iqra 1" },
  { book: 1, page: 2, category: 'intro', title: "Pengenalan", lines: ["بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"], description: "Bismillah dan petunjuk penggunaan" },
  
  // Alif & Ba (hal 3-6)
  { book: 1, page: 3, category: 'lesson', title: "Alif & Ba (1)", lines: ["أَ", "بَ"], description: "Pengenalan huruf Alif dan Ba" },
  { book: 1, page: 4, category: 'lesson', title: "Alif & Ba (2)", lines: ["أَ بَ", "أَ أَ بَ بَ"], description: "Latihan kombinasi Alif Ba" },
  { book: 1, page: 5, category: 'exercise', title: "Latihan Alif & Ba (1)", lines: ["أَ بَ أَ بَ", "بَ أَ بَ أَ", "أَ أَ بَ بَ"], description: "Latihan membaca Alif Ba" },
  { book: 1, page: 6, category: 'exercise', title: "Latihan Alif & Ba (2)", lines: ["أَ بَ بَ أَ", "بَ بَ أَ أَ", "أَ أَ أَ بَ"], description: "Latihan lanjutan" },
  
  // Ta & Tsa (hal 7-10)
  { book: 1, page: 7, category: 'lesson', title: "Ta", lines: ["تَ", "أَ تَ بَ تَ"], description: "Pengenalan huruf Ta" },
  { book: 1, page: 8, category: 'exercise', title: "Latihan Ta (1)", lines: ["تَ أَ تَ بَ", "بَ تَ بَ تَ", "أَ تَ أَ تَ"], description: "Latihan huruf Ta" },
  { book: 1, page: 9, category: 'lesson', title: "Tsa", lines: ["ثَ", "تَ ثَ بَ ثَ"], description: "Pengenalan huruf Tsa" },
  { book: 1, page: 10, category: 'exercise', title: "Latihan Ta & Tsa", lines: ["تَ ثَ تَ ثَ", "ثَ تَ ثَ تَ", "أَ ثَ بَ تَ ثَ"], description: "Latihan kombinasi" },
  
  // Jim (hal 11-13)
  { book: 1, page: 11, category: 'lesson', title: "Jim", lines: ["جَ", "أَ جَ بَ جَ تَ جَ"], description: "Pengenalan huruf Jim" },
  { book: 1, page: 12, category: 'exercise', title: "Latihan Jim (1)", lines: ["جَ أَ جَ بَ", "تَ جَ ثَ جَ", "جَ جَ أَ بَ"], description: "Latihan huruf Jim" },
  { book: 1, page: 13, category: 'exercise', title: "Latihan Jim (2)", lines: ["أَ بَ تَ ثَ جَ", "جَ ثَ تَ بَ أَ", "بَ جَ أَ ثَ تَ"], description: "Latihan kombinasi dengan Jim" },
  
  // Ha (hal 14-16)
  { book: 1, page: 14, category: 'lesson', title: "Ha", lines: ["حَ", "جَ حَ تَ حَ"], description: "Pengenalan huruf Ha" },
  { book: 1, page: 15, category: 'exercise', title: "Latihan Ha (1)", lines: ["حَ جَ حَ تَ", "أَ حَ بَ حَ ثَ حَ", "جَ حَ جَ حَ"], description: "Latihan huruf Ha" },
  { book: 1, page: 16, category: 'exercise', title: "Latihan Ha (2)", lines: ["حَ أَ بَ تَ", "ثَ جَ حَ أَ", "بَ حَ تَ جَ"], description: "Latihan kombinasi" },
  
  // Kha (hal 17-19)
  { book: 1, page: 17, category: 'lesson', title: "Kha", lines: ["خَ", "حَ خَ جَ خَ"], description: "Pengenalan huruf Kha" },
  { book: 1, page: 18, category: 'exercise', title: "Latihan Kha (1)", lines: ["خَ حَ خَ جَ", "تَ خَ ثَ خَ", "أَ خَ بَ خَ"], description: "Latihan huruf Kha" },
  { book: 1, page: 19, category: 'exercise', title: "Latihan Kha (2)", lines: ["خَ جَ حَ تَ", "أَ بَ ثَ خَ", "حَ خَ أَ جَ"], description: "Latihan kombinasi" },
  
  // Dal (hal 20-22)
  { book: 1, page: 20, category: 'lesson', title: "Dal", lines: ["دَ", "خَ دَ حَ دَ جَ دَ"], description: "Pengenalan huruf Dal" },
  { book: 1, page: 21, category: 'exercise', title: "Latihan Dal (1)", lines: ["دَ خَ دَ حَ", "جَ دَ تَ دَ", "دَ أَ دَ بَ"], description: "Latihan huruf Dal" },
  { book: 1, page: 22, category: 'exercise', title: "Latihan Dal (2)", lines: ["دَ حَ خَ جَ", "أَ بَ تَ دَ", "خَ دَ أَ حَ"], description: "Latihan kombinasi Dal" },
  
  // Dzal (hal 23-25)
  { book: 1, page: 23, category: 'lesson', title: "Dzal", lines: ["ذَ", "دَ ذَ خَ ذَ"], description: "Pengenalan huruf Dzal" },
  { book: 1, page: 24, category: 'exercise', title: "Latihan Dzal (1)", lines: ["ذَ دَ ذَ حَ", "خَ ذَ جَ ذَ", "ذَ أَ ذَ بَ"], description: "Latihan huruf Dzal" },
  { book: 1, page: 25, category: 'exercise', title: "Latihan Dzal (2)", lines: ["دَ ذَ خَ حَ", "أَ ذَ تَ جَ", "ذَ بَ دَ خَ"], description: "Latihan kombinasi" },
  
  // Ra & Zai (hal 26-28)
  { book: 1, page: 26, category: 'lesson', title: "Ra & Zai", lines: ["رَ", "زَ", "ذَ رَ دَ زَ"], description: "Pengenalan Ra dan Zai" },
  { book: 1, page: 27, category: 'exercise', title: "Latihan Ra & Zai (1)", lines: ["رَ زَ رَ زَ", "دَ رَ ذَ زَ", "أَ رَ بَ زَ"], description: "Latihan Ra Zai" },
  { book: 1, page: 28, category: 'exercise', title: "Latihan Ra & Zai (2)", lines: ["رَ أَ زَ بَ", "تَ رَ ثَ زَ", "جَ رَ حَ زَ"], description: "Latihan kombinasi" },
  
  // Sin & Syin (hal 29-31)
  { book: 1, page: 29, category: 'lesson', title: "Sin & Syin", lines: ["سَ", "شَ", "زَ سَ رَ شَ"], description: "Pengenalan Sin dan Syin" },
  { book: 1, page: 30, category: 'exercise', title: "Latihan Sin & Syin (1)", lines: ["سَ شَ سَ شَ", "رَ سَ زَ شَ", "دَ سَ ذَ شَ"], description: "Latihan Sin Syin" },
  { book: 1, page: 31, category: 'exercise', title: "Latihan Sin & Syin (2)", lines: ["سَ أَ شَ بَ", "تَ سَ ثَ شَ", "جَ سَ حَ شَ"], description: "Latihan kombinasi" },
  
  // Shad & Dhad (hal 32-34)
  { book: 1, page: 32, category: 'lesson', title: "Shad & Dhad", lines: ["صَ", "ضَ", "شَ صَ سَ ضَ"], description: "Pengenalan Shad dan Dhad" },
  { book: 1, page: 33, category: 'exercise', title: "Latihan Shad & Dhad (1)", lines: ["صَ ضَ صَ ضَ", "سَ صَ شَ ضَ", "رَ صَ زَ ضَ"], description: "Latihan Shad Dhad" },
  { book: 1, page: 34, category: 'exercise', title: "Latihan Shad & Dhad (2)", lines: ["صَ أَ ضَ بَ", "تَ صَ ثَ ضَ", "جَ صَ حَ ضَ"], description: "Latihan kombinasi" },
  
  // Tha & Zha (hal 35-37)
  { book: 1, page: 35, category: 'lesson', title: "Tha & Zha", lines: ["طَ", "ظَ", "ضَ طَ صَ ظَ"], description: "Pengenalan Tha dan Zha" },
  { book: 1, page: 36, category: 'exercise', title: "Latihan Tha & Zha (1)", lines: ["طَ ظَ طَ ظَ", "صَ طَ ضَ ظَ", "سَ طَ شَ ظَ"], description: "Latihan Tha Zha" },
  { book: 1, page: 37, category: 'exercise', title: "Latihan Tha & Zha (2)", lines: ["طَ أَ ظَ بَ", "تَ طَ ثَ ظَ", "جَ طَ حَ ظَ"], description: "Latihan kombinasi" },
  
  // Ain & Ghain (hal 38-40)
  { book: 1, page: 38, category: 'lesson', title: "Ain & Ghain", lines: ["عَ", "غَ", "ظَ عَ طَ غَ"], description: "Pengenalan Ain dan Ghain" },
  { book: 1, page: 39, category: 'exercise', title: "Latihan Ain & Ghain (1)", lines: ["عَ غَ عَ غَ", "طَ عَ ظَ غَ", "صَ عَ ضَ غَ"], description: "Latihan Ain Ghain" },
  { book: 1, page: 40, category: 'exercise', title: "Latihan Ain & Ghain (2)", lines: ["عَ أَ غَ بَ", "تَ عَ ثَ غَ", "جَ عَ حَ غَ"], description: "Latihan kombinasi" },
  
  // Fa & Qaf (hal 41-43)
  { book: 1, page: 41, category: 'lesson', title: "Fa & Qaf", lines: ["فَ", "قَ", "غَ فَ عَ قَ"], description: "Pengenalan Fa dan Qaf" },
  { book: 1, page: 42, category: 'exercise', title: "Latihan Fa & Qaf (1)", lines: ["فَ قَ فَ قَ", "عَ فَ غَ قَ", "طَ فَ ظَ قَ"], description: "Latihan Fa Qaf" },
  { book: 1, page: 43, category: 'exercise', title: "Latihan Fa & Qaf (2)", lines: ["فَ أَ قَ بَ", "تَ فَ ثَ قَ", "جَ فَ حَ قَ"], description: "Latihan kombinasi" },
  
  // Kaf & Lam (hal 44-46)
  { book: 1, page: 44, category: 'lesson', title: "Kaf & Lam", lines: ["كَ", "لَ", "قَ كَ فَ لَ"], description: "Pengenalan Kaf dan Lam" },
  { book: 1, page: 45, category: 'exercise', title: "Latihan Kaf & Lam (1)", lines: ["كَ لَ كَ لَ", "فَ كَ قَ لَ", "عَ كَ غَ لَ"], description: "Latihan Kaf Lam" },
  { book: 1, page: 46, category: 'exercise', title: "Latihan Kaf & Lam (2)", lines: ["كَ أَ لَ بَ", "تَ كَ ثَ لَ", "جَ كَ حَ لَ"], description: "Latihan kombinasi" },
  
  // Mim, Nun, Wau, Ha, Ya (hal 47)
  { book: 1, page: 47, category: 'review', title: "Penutup Iqra 1", lines: ["مَ نَ وَ هَ يَ", "أَ بَ تَ ثَ جَ حَ خَ", "دَ ذَ رَ زَ سَ شَ صَ ضَ", "طَ ظَ عَ غَ فَ قَ كَ لَ مَ نَ وَ هَ يَ"], description: "Review semua huruf Hijaiyah" },

  // ==========================================
  // IQRA 2: Huruf Bersambung & Mad (32 halaman)
  // ==========================================
  
  { book: 2, page: 1, category: 'cover', title: "Cover Iqra 2", lines: ["إِقْرَأْ ٢"], description: "Cover buku Iqra 2" },
  { book: 2, page: 2, category: 'intro', title: "Pengenalan", lines: ["Huruf Bersambung", "& Bacaan Panjang (Mad)"], description: "Petunjuk Iqra 2" },
  
  // Huruf bersambung ba-ta-tsa (hal 3-5)
  { book: 2, page: 3, category: 'lesson', title: "Sambung Ba-Ta", lines: ["بَ + تَ = بَتَ", "تَ + بَ = تَبَ"], description: "Belajar menyambung huruf" },
  { book: 2, page: 4, category: 'exercise', title: "Latihan Sambung 1", lines: ["بَتَ تَبَ", "نَبَتَ بَعَثَ", "ثَبَتَ تَرَثَ"], description: "Latihan huruf bersambung" },
  { book: 2, page: 5, category: 'exercise', title: "Latihan Sambung 2", lines: ["بَدَنَ نَزَلَ", "تَرَكَ وَزَنَ", "يَدَهُ بَعَثَ"], description: "Latihan kata lengkap" },
  
  // Jim-ha-kha (hal 6-8)
  { book: 2, page: 6, category: 'lesson', title: "Sambung Jim-Ha", lines: ["جَ + دَ = جَدَ", "حَ + بَ = حَبَ", "خَ + لَ = خَلَ"], description: "Sambungan Jim, Ha, Kha" },
  { book: 2, page: 7, category: 'exercise', title: "Latihan Jim-Ha-Kha", lines: ["سَجَدَ جَمَعَ", "فَتَحَ أَخَذَ", "خَتَمَ بَحَثَ"], description: "Latihan kata dengan Jim-Ha-Kha" },
  { book: 2, page: 8, category: 'review', title: "Review Sambung", lines: ["وَجَدَ سَجَدَ", "خَرَجَ دَخَلَ", "جَرَحَ مَسَحَ"], description: "Review huruf bersambung" },
  
  // Mad Alif (hal 9-12)
  { book: 2, page: 9, category: 'lesson', title: "Mad Alif", lines: ["بَا تَا ثَا", "جَا حَا خَا"], description: "Bacaan panjang dengan Alif" },
  { book: 2, page: 10, category: 'exercise', title: "Latihan Mad Alif 1", lines: ["دَا ذَا رَا زَا", "سَا شَا صَا ضَا"], description: "Latihan Mad Alif" },
  { book: 2, page: 11, category: 'exercise', title: "Latihan Mad Alif 2", lines: ["تَابَ جَادَ حَالَ", "خَافَ دَارَ زَادَ"], description: "Mad Alif dalam kata" },
  { book: 2, page: 12, category: 'exercise', title: "Mad Alif dalam Ayat", lines: ["قَالَ كَانَ", "مَالَهُ أَبَاهُ", "وَمَا لَنَا"], description: "Mad Alif konteks ayat" },
  
  // Kasrah (hal 13-16)
  { book: 2, page: 13, category: 'lesson', title: "Harakat Kasrah", lines: ["بِ تِ ثِ جِ", "حِ خِ دِ ذِ"], description: "Pengenalan Kasrah" },
  { book: 2, page: 14, category: 'exercise', title: "Latihan Kasrah 1", lines: ["رِ زِ سِ شِ", "صِ ضِ طِ ظِ"], description: "Latihan baca Kasrah" },
  { book: 2, page: 15, category: 'exercise', title: "Latihan Kasrah 2", lines: ["إِبِلٌ رَدِفَ", "شَهِدَ عَمِلَ", "بَخِلَ سَخِطَ"], description: "Kasrah dalam kata" },
  { book: 2, page: 16, category: 'exercise', title: "Kasrah Lanjutan", lines: ["فِئَةٍ مِائَةٍ", "صِحَافًا كِرَامًا", "عِصَامَ قِيَامَةٌ"], description: "Kasrah dalam kalimat" },
  
  // Mad Ya (hal 17-20)
  { book: 2, page: 17, category: 'lesson', title: "Mad Ya", lines: ["بِي تِي ثِي جِي", "حِي خِي دِي ذِي"], description: "Kasrah panjang (Mad Ya)" },
  { book: 2, page: 18, category: 'exercise', title: "Latihan Mad Ya 1", lines: ["رِي زِي سِي شِي", "صِي ضِي طِي ظِي"], description: "Latihan Mad Ya" },
  { book: 2, page: 19, category: 'exercise', title: "Latihan Mad Ya 2", lines: ["فِيهِ دِينِهِ", "قِيلَ جِيءَ", "نُورِيهِ أَبِيهِ"], description: "Mad Ya dalam kata" },
  { book: 2, page: 20, category: 'exercise', title: "Mad Ya Lanjutan", lines: ["فِي السَّمَاءِ", "مِنَ الْكِتَابِ", "إِلَى الصِّرَاطِ"], description: "Mad Ya dalam ayat" },
  
  // Dhammah (hal 21-24)
  { book: 2, page: 21, category: 'lesson', title: "Harakat Dhammah", lines: ["بُ تُ ثُ جُ", "حُ خُ دُ ذُ"], description: "Pengenalan Dhammah" },
  { book: 2, page: 22, category: 'exercise', title: "Latihan Dhammah 1", lines: ["رُ زُ سُ شُ", "صُ ضُ طُ ظُ"], description: "Latihan baca Dhammah" },
  { book: 2, page: 23, category: 'exercise', title: "Latihan Dhammah 2", lines: ["كُتِبَ رُزِقَ", "ذُكِرَ جُعِلَ", "سُئِلَ فُتِحَ"], description: "Dhammah dalam kata" },
  { book: 2, page: 24, category: 'exercise', title: "Dhammah Lanjutan", lines: ["نُورٌ قُدْرَةٌ", "رُسُلٌ كُتُبٌ", "سُبْحَانَ حُسْنًا"], description: "Dhammah dalam kalimat" },
  
  // Mad Wau (hal 25-28)
  { book: 2, page: 25, category: 'lesson', title: "Mad Wau", lines: ["بُو تُو ثُو جُو", "حُو خُو دُو ذُو"], description: "Dhammah panjang (Mad Wau)" },
  { book: 2, page: 26, category: 'exercise', title: "Latihan Mad Wau 1", lines: ["رُو زُو سُو شُو", "صُو ضُو طُو ظُو"], description: "Latihan Mad Wau" },
  { book: 2, page: 27, category: 'exercise', title: "Latihan Mad Wau 2", lines: ["يَتُوبُ يَعُودُ", "يَقُولُ تَكُونُ", "أَعُوذُ نُوحٌ"], description: "Mad Wau dalam kata" },
  { book: 2, page: 28, category: 'exercise', title: "Mad Wau Lanjutan", lines: ["قُلْ هُوَ اللَّهُ", "يَوْمَ الْقِيَامَةِ", "وَهُوَ عَلَى كُلِّ"], description: "Mad Wau dalam ayat" },
  
  // Review & Campuran (hal 29-32)
  { book: 2, page: 29, category: 'review', title: "Latihan Campuran 1", lines: ["قَالَ لَهُ رَبُّهُ", "آمَنَ وَعَمِلَ", "هُدًى وَرَحْمَةً"], description: "Campuran Fathah, Kasrah, Dhammah" },
  { book: 2, page: 30, category: 'review', title: "Latihan Campuran 2", lines: ["فِي جِيدِهَا حَبْلٌ", "يُوسُفُ أَعْرِضْ", "وَلَا أَنَا عَابِدٌ"], description: "Review semua Mad" },
  { book: 2, page: 31, category: 'review', title: "Latihan Campuran 3", lines: ["مِنَ الْمُؤْمِنِينَ", "إِنَّ اللَّهَ غَفُورٌ", "وَهُوَ عَلَى كُلِّ شَيْءٍ"], description: "Gabungan semua harakat" },
  { book: 2, page: 32, category: 'review', title: "Penutup Iqra 2", lines: ["رَبِّ اغْفِرْ وَارْحَمْ", "وَأَنْتَ خَيْرُ الرَّاحِمِينَ", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"], description: "Review akhir Iqra 2" },

  // ==========================================
  // IQRA 3: Mad Lanjutan & Tanwin (32 halaman)
  // ==========================================
  
  { book: 3, page: 1, category: 'cover', title: "Cover Iqra 3", lines: ["إِقْرَأْ ٣"], description: "Cover buku Iqra 3" },
  { book: 3, page: 2, category: 'intro', title: "Pengenalan", lines: ["Mad Lanjutan", "& Tanwin"], description: "Petunjuk Iqra 3" },
  
  // Mad untuk 2 huruf (hal 3-5)
  { book: 3, page: 3, category: 'lesson', title: "Mad Alif 2 Huruf", lines: ["فَعَلَا جَعَلَا", "جَمَعَا ذَهَبَا"], description: "Mad Alif untuk dua huruf" },
  { book: 3, page: 4, category: 'exercise', title: "Latihan Mad 2 Huruf", lines: ["كَفَرَا ظَلَمَا", "عَمِلَا قَالَا", "تَابَا رَجَعَا"], description: "Latihan Mad untuk fi'il tatsniyah" },
  { book: 3, page: 5, category: 'exercise', title: "Mad 2 Huruf Lanjutan", lines: ["هُمَا ذَهَبَا", "اللَّذَانِ آمَنَا", "عَلَيْهِمَا قَالَا"], description: "Konteks dalam kalimat" },
  
  // Alif Madd (hal 6-8)
  { book: 3, page: 6, category: 'lesson', title: "Alif Madd", lines: ["آمَنَ آدَمَ", "آوَى آخَرَ"], description: "Alif dengan Madd" },
  { book: 3, page: 7, category: 'exercise', title: "Latihan Alif Madd", lines: ["آيَاتٍ آمِنِينَ", "آتَى آخِرَةَ", "الْقُرْآنُ إِيمَانٌ"], description: "Latihan Alif Madd" },
  { book: 3, page: 8, category: 'exercise', title: "Alif Madd dalam Ayat", lines: ["آمَنَ الرَّسُولُ", "مَا آتَاكُمُ الرَّسُولُ", "إِنَّ اللَّهَ آمَرَكُمْ"], description: "Alif Madd konteks ayat" },
  
  // Hamzah di tengah (hal 9-11)
  { book: 3, page: 9, category: 'lesson', title: "Hamzah Tengah", lines: ["رَأَى كَوْكَبًا", "جَاءَ شَاءَ"], description: "Hamzah di tengah kata" },
  { book: 3, page: 10, category: 'exercise', title: "Latihan Hamzah Tengah", lines: ["جَاءَكُمْ نَبَأٌ", "شَاءَ اللَّهُ", "مَاءً سَمَاءً"], description: "Latihan Hamzah" },
  { book: 3, page: 11, category: 'exercise', title: "Hamzah Lanjutan", lines: ["يَشَاءُ سَوْءَةَ", "مَاءَكُمْ بِنَاءً", "جَزَاءً فَيُجَازِيَهُ"], description: "Hamzah dalam kalimat" },
  
  // Alif Maqsurah (hal 12-14)
  { book: 3, page: 12, category: 'lesson', title: "Alif Maqsurah", lines: ["عَلَى إِلَى", "هُدًى رِضًى"], description: "Alif Maqsurah (ى)" },
  { book: 3, page: 13, category: 'exercise', title: "Latihan Alif Maqsurah", lines: ["فَسَوَّى فَقَضَى", "أَعْطَى تَجَلَّى", "مُوسَى عِيسَى"], description: "Latihan Alif Maqsurah" },
  { book: 3, page: 14, category: 'exercise', title: "Alif Maqsurah Lanjutan", lines: ["عَلَى الْهُدَى", "إِلَى أَجَلٍ مُسَمًّى", "تَرَى الْأَعْمَى"], description: "Dalam konteks" },
  
  // Mad Ya dalam kata (hal 15-17)
  { book: 3, page: 15, category: 'lesson', title: "Mad Ya Lanjutan", lines: ["أَرِنِي أَرِنَا", "يُحْيِي يُمِيتُ"], description: "Mad Ya dalam kata" },
  { book: 3, page: 16, category: 'exercise', title: "Latihan Mad Ya", lines: ["فِيهَا كُتُبٌ", "عَلَيْهِمْ مِنْهُمْ", "إِلَيْهِ بِهِ"], description: "Latihan Mad Ya" },
  { book: 3, page: 17, category: 'exercise', title: "Ha Dhamir", lines: ["لَهُ مَا فِيهِ", "مِثْلِهِ بِهِ", "عِبَادِهِ رُسُلَهُ"], description: "Huruf Ha sebagai dhamir" },
  
  // Tanwin Dhammah (hal 18-20)
  { book: 3, page: 18, category: 'lesson', title: "Tanwin Dhammah (ٌ)", lines: ["بٌ تٌ ثٌ جٌ", "حٌ خٌ dٌ ذٌ"], description: "Pengenalan Tanwin Dhammah" },
  { book: 3, page: 19, category: 'exercise', title: "Latihan Tanwin Dhammah", lines: ["أَحَدٌ رُسُلٌ", "عَذَابٌ كِتَابٌ", "نُورٌ هُدًى"], description: "Latihan Tanwin ٌ" },
  { book: 3, page: 20, category: 'exercise', title: "Tanwin Dhammah Lanjutan", lines: ["غَفُورٌ عَلِيمٌ", "حَكِيمٌ عَظِيمٌ", "لَطِيفٌ خَبِيرٌ"], description: "Sifat Allah dengan Tanwin" },
  
  // Tanwin Kasrah (hal 21-23)
  { book: 3, page: 21, category: 'lesson', title: "Tanwin Kasrah (ٍ)", lines: ["بٍ تٍ ثٍ جٍ", "حٍ خٍ dٍ ذٍ"], description: "Pengenalan Tanwin Kasrah" },
  { book: 3, page: 22, category: 'exercise', title: "Latihan Tanwin Kasrah", lines: ["أَحَدٍ رُسُلٍ", "عَذَابٍ كِتَابٍ", "شَيْءٍ قَوْمٍ"], description: "Latihan Tanwin ٍ" },
  { book: 3, page: 23, category: 'exercise', title: "Tanwin Kasrah Lanjutan", lines: ["غَفُورٍ عَلِيمٍ", "حَكِيمٍ عَظِيمٍ", "مِنْ شَيْءٍ قَدِيرٍ"], description: "Tanwin Kasrah dalam kalimat" },
  
  // Tanwin Fathah (hal 24-26)
  { book: 3, page: 24, category: 'lesson', title: "Tanwin Fathah (ًا)", lines: ["بًا تًا ثًا جًا", "حًا خًا دًا ذًا"], description: "Pengenalan Tanwin Fathah" },
  { book: 3, page: 25, category: 'exercise', title: "Latihan Tanwin Fathah", lines: ["أَحَدًا رُسُلًا", "عَذَابًا كِتَابًا", "نُورًا هُدًى"], description: "Latihan Tanwin ًا" },
  { book: 3, page: 26, category: 'exercise', title: "Tanwin Fathah Lanjutan", lines: ["غَفُورًا عَلِيمًا", "حَكِيمًا عَظِيمًا", "لَطِيفًا خَبِيرًا"], description: "Tanwin Fathah dalam kalimat" },
  
  // Campuran Tanwin (hal 27-29)
  { book: 3, page: 27, category: 'review', title: "Campuran Tanwin", lines: ["قَوْمًا كَافِرِينَ", "عَذَابٌ أَلِيمٌ", "شَيْئًا قَدِيرًا"], description: "Gabungan semua Tanwin" },
  { book: 3, page: 28, category: 'review', title: "Latihan Tanwin", lines: ["نَفْسًا وَاحِدَةً", "خَيْرٌ لَكُمْ", "عِلْمًا وَحُكْمًا"], description: "Tanwin dalam ayat" },
  { book: 3, page: 29, category: 'review', title: "Review Tanwin", lines: ["رَبًّا غَفُورًا", "عَمَلًا صَالِحًا", "أَجْرًا عَظِيمًا"], description: "Review semua Tanwin" },
  
  // Surah pendek (hal 30-32)
  { book: 3, page: 30, category: 'exercise', title: "Surah An-Nasr (1)", lines: ["إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ"], description: "Latihan bacaan An-Nasr" },
  { book: 3, page: 31, category: 'exercise', title: "Surah An-Nasr (2)", lines: ["فِي دِينِ اللَّهِ أَفْوَاجًا", "فَسَبِّحْ بِحَمْدِ رَبِّكَ"], description: "Lanjutan An-Nasr" },
  { book: 3, page: 32, category: 'review', title: "Penutup Iqra 3", lines: ["وَاسْتَغْفِرْهُ", "إِنَّهُ كَانَ تَوَّابًا"], description: "Penutup An-Nasr & Iqra 3" },

  // ==========================================
  // IQRA 4: Sukun, Qalqalah, Tasydid (32 halaman)
  // ==========================================
  
  { book: 4, page: 1, category: 'cover', title: "Cover Iqra 4", lines: ["إِقْرَأْ ٤"], description: "Cover buku Iqra 4" },
  { book: 4, page: 2, category: 'intro', title: "Pengenalan", lines: ["Huruf Mati (Sukun)", "Qalqalah & Tasydid"], description: "Petunjuk Iqra 4" },
  
  // Sukun Ba-Ta-Tsa (hal 3-5)
  { book: 4, page: 3, category: 'lesson', title: "Sukun Ba-Ta-Tsa", lines: ["أَبْ أَتْ أَثْ", "بَبْ تَتْ ثَثْ"], description: "Huruf mati (sukun) Ba-Ta-Tsa" },
  { book: 4, page: 4, category: 'exercise', title: "Latihan Sukun 1", lines: ["يَبْخَلْ يَتْرُكْ", "تُبْ فَاسْتَقِمْ", "اِثْبُتُوا اِجْتَنِبُوا"], description: "Latihan huruf mati" },
  { book: 4, page: 5, category: 'exercise', title: "Sukun Ba-Ta Lanjutan", lines: ["كَتَبْتُمْ حَسِبْتُمْ", "ثَبَّتَ وَبَشِّرْ", "اصْبِرْ وَاصْطَبِرْ"], description: "Sukun dalam kata" },
  
  // Sukun Jim-Ha-Kha (hal 6-8)
  { book: 4, page: 6, category: 'lesson', title: "Sukun Jim-Ha-Kha", lines: ["أَجْ أَحْ أَخْ", "جَجْ حَحْ خَخْ"], description: "Sukun Jim-Ha-Kha" },
  { book: 4, page: 7, category: 'exercise', title: "Latihan Sukun Jim-Ha-Kha", lines: ["يَجْعَلْ يَحْسَبْ", "أَخْرَجَ نُخْرِجْ", "اُنْحَرْ افْتَحْ"], description: "Latihan Jim-Ha-Kha mati" },
  { book: 4, page: 8, category: 'exercise', title: "Sukun Lanjutan", lines: ["أَنْعَمْتَ عَلَيْهِمْ", "يَسْتَكْبِرُونَ", "إِسْرَافًا مُسْرِفِينَ"], description: "Sukun dalam ayat" },
  
  // Sukun Mim & Nun (hal 9-11)
  { book: 4, page: 9, category: 'lesson', title: "Sukun Mim", lines: ["قُمْ صُمْ هُمْ", "لَمْ كَمْ أَمْ"], description: "Mim mati" },
  { book: 4, page: 10, category: 'lesson', title: "Sukun Nun", lines: ["عَنْ مِنْ إِنْ", "أَنْ أَنْتُمْ"], description: "Nun mati" },
  { book: 4, page: 11, category: 'exercise', title: "Latihan Mim & Nun Mati", lines: ["قُمْ فَأَنْذِرْ", "كُنْتُمْ خَيْرَ أُمَّةٍ", "مِنْ قَبْلُ وَمِنْ بَعْدُ"], description: "Latihan Mim & Nun mati" },
  
  // Qalqalah (hal 12-15)
  { book: 4, page: 12, category: 'lesson', title: "Qalqalah", lines: ["ق ط ب ج د", "قُدْرَتُهُ قَطْعًا"], description: "Huruf Qalqalah" },
  { book: 4, page: 13, category: 'exercise', title: "Latihan Qalqalah Qaf", lines: ["يَقْطَعُونَ أَقْرَبُ", "قَدْ أَفْلَحَ", "خَلَقْنَا رَزَقْنَا"], description: "Qalqalah Qaf" },
  { book: 4, page: 14, category: 'exercise', title: "Latihan Qalqalah Tha-Ba", lines: ["يُبْدِئُ يَبْصُرُونَ", "حَبْلٌ فَاصْبِرْ", "بَطَنَ نَبْتًا"], description: "Qalqalah Tha & Ba" },
  { book: 4, page: 15, category: 'exercise', title: "Latihan Qalqalah Jim-Dal", lines: ["يَجْعَلُونَ يَدْعُونَ", "أَجْرًا وَجَدَ", "سَجَدَ أَحَدٌ"], description: "Qalqalah Jim & Dal" },
  
  // Tasydid Nun & Mim (hal 16-20)
  { book: 4, page: 16, category: 'lesson', title: "Nun Tasydid", lines: ["إِنَّ أَنَّ", "كَأَنَّ لَكِنَّ"], description: "Nun bertasydid" },
  { book: 4, page: 17, category: 'exercise', title: "Latihan Nun Tasydid", lines: ["إِنَّنِي أَنَّكُمْ", "إِنَّ اللَّهَ غَفُورٌ", "أَنَّ اللَّهَ عَلِيمٌ"], description: "Latihan Nun tasydid" },
  { book: 4, page: 18, category: 'lesson', title: "Mim Tasydid", lines: ["ثُمَّ عَمَّ", "فَلَمَّا أَمَّا"], description: "Mim bertasydid" },
  { book: 4, page: 19, category: 'exercise', title: "Latihan Mim Tasydid", lines: ["إِمَّا يَنْزَغَنَّكَ", "ثُمَّ إِنَّكُمْ", "لَمَّا جَاءَهُمْ"], description: "Latihan Mim tasydid" },
  { book: 4, page: 20, category: 'review', title: "Review Tasydid", lines: ["مِنَ الْجِنَّةِ وَالنَّاسِ", "إِنَّ رَبَّكَ لَبِالْمِرْصَادِ", "ثُمَّ إِنَّهُمْ لَصَالُو الْجَحِيمِ"], description: "Review Nun & Mim tasydid" },
  
  // Latihan campuran (hal 21-28)
  { book: 4, page: 21, category: 'review', title: "Latihan Campuran 1", lines: ["اقْرَأْ بِاسْمِ رَبِّكَ", "الَّذِي خَلَقَ", "خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ"], description: "Campuran Sukun & Qalqalah" },
  { book: 4, page: 22, category: 'review', title: "Latihan Campuran 2", lines: ["اقْرَأْ وَرَبُّكَ الْأَكْرَمُ", "الَّذِي عَلَّمَ بِالْقَلَمِ", "عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ"], description: "Lanjutan Al-Alaq" },
  { book: 4, page: 23, category: 'review', title: "Latihan Campuran 3", lines: ["كَلَّا إِنَّ الْإِنْسَانَ لَيَطْغَى", "أَنْ رَآهُ اسْتَغْنَى", "إِنَّ إِلَى رَبِّكَ الرُّجْعَى"], description: "Review dengan ayat panjang" },
  { book: 4, page: 24, category: 'exercise', title: "Al-Kafirun (1)", lines: ["قُلْ يَا أَيُّهَا الْكَافِرُونَ", "لَا أَعْبُدُ مَا تَعْبُدُونَ"], description: "Surah Al-Kafirun bagian 1" },
  { book: 4, page: 25, category: 'exercise', title: "Al-Kafirun (2)", lines: ["وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ"], description: "Surah Al-Kafirun bagian 2" },
  { book: 4, page: 26, category: 'exercise', title: "Al-Kafirun (3)", lines: ["وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", "لَكُمْ دِينُكُمْ وَلِيَ دِينِ"], description: "Surah Al-Kafirun bagian 3" },
  { book: 4, page: 27, category: 'review', title: "Review Iqra 4 (1)", lines: ["سُبْحَانَ رَبِّيَ الْعَظِيمِ", "سُبْحَانَ رَبِّيَ الْأَعْلَى", "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ"], description: "Bacaan dalam shalat" },
  { book: 4, page: 28, category: 'review', title: "Review Iqra 4 (2)", lines: ["رَبَّنَا وَلَكَ الْحَمْدُ", "التَّحِيَّاتُ لِلَّهِ", "السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ"], description: "Tahiyyat awal" },
  { book: 4, page: 29, category: 'review', title: "Review Iqra 4 (3)", lines: ["وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ", "السَّلَامُ عَلَيْنَا", "وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ"], description: "Tahiyyat lanjutan" },
  { book: 4, page: 30, category: 'review', title: "Review Iqra 4 (4)", lines: ["أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ", "وَأَشْهَدُ أَنَّ مُحَمَّدًا", "رَسُولُ اللَّهِ"], description: "Syahadat" },
  { book: 4, page: 31, category: 'review', title: "Latihan Akhir 1", lines: ["اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", "وَعَلَى آلِ مُحَمَّدٍ", "كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ"], description: "Shalawat Ibrahimiyyah" },
  { book: 4, page: 32, category: 'review', title: "Penutup Iqra 4", lines: ["وَبَارِكْ عَلَى مُحَمَّدٍ", "وَعَلَى آلِ مُحَمَّدٍ", "إِنَّكَ حَمِيدٌ مَجِيدٌ"], description: "Penutup Iqra 4" },

  // ==========================================
  // IQRA 5: Alif Lam, Waqaf, Mad (32 halaman)
  // ==========================================
  
  { book: 5, page: 1, category: 'cover', title: "Cover Iqra 5", lines: ["إِقْرَأْ ٥"], description: "Cover buku Iqra 5" },
  { book: 5, page: 2, category: 'intro', title: "Pengenalan", lines: ["Alif Lam", "Tasydid & Waqaf"], description: "Petunjuk Iqra 5" },
  
  // Tasydid semua huruf (hal 3-6)
  { book: 5, page: 3, category: 'lesson', title: "Tasydid (1)", lines: ["أَبًّا حَقًّا شَرًّا", "عَدُوًّا قُوَّةً"], description: "Tasydid berbagai huruf" },
  { book: 5, page: 4, category: 'exercise', title: "Latihan Tasydid 1", lines: ["إِنَّ رَبَّكَ", "ثُمَّ إِنَّهُمْ", "كَذَّبَ وَتَوَلَّى"], description: "Latihan Tasydid" },
  { book: 5, page: 5, category: 'exercise', title: "Latihan Tasydid 2", lines: ["نَزَّلَ فَصَّلَ", "عَلَّمَ كَرَّمَ", "طَهَّرَ وَ نَقَّى"], description: "Tasydid dalam kata kerja" },
  { book: 5, page: 6, category: 'exercise', title: "Tasydid Lanjutan", lines: ["الصَّلَاةَ الزَّكَاةَ", "النَّارَ الْجَنَّةَ", "السَّمَاءَ الْأَرْضَ"], description: "Tasydid dalam kata benda" },
  
  // Alif Lam Qamariyyah (hal 7-10)
  { book: 5, page: 7, category: 'lesson', title: "Alif Lam Qamariyyah", lines: ["الْ = Al-", "الْقَمَرُ الْكِتَابُ"], description: "Al- yang jelas (Qamariyyah)" },
  { book: 5, page: 8, category: 'exercise', title: "Latihan Al- Qamariyyah 1", lines: ["الْيَوْمُ الْجَنَّةُ", "الْعَالَمِينَ الْغَفُورُ", "الْفَاتِحَةُ الْقُرْآنُ"], description: "Latihan Alif Lam Qamariyyah" },
  { book: 5, page: 9, category: 'exercise', title: "Latihan Al- Qamariyyah 2", lines: ["الْكَافِرُونَ الْمُؤْمِنُونَ", "الْهُدَى الْوَاحِدُ", "الْبَيْتِ الْحَرَامِ"], description: "Al- Qamariyyah dalam kata" },
  { book: 5, page: 10, category: 'exercise', title: "Al- Qamariyyah Lanjutan", lines: ["الْحَمْدُ لِلَّهِ", "رَبِّ الْعَالَمِينَ", "مَالِكِ الْيَوْمِ الدِّينِ"], description: "Al- Qamariyyah dalam ayat" },
  
  // Alif Lam Syamsiyyah (hal 11-14)
  { book: 5, page: 11, category: 'lesson', title: "Alif Lam Syamsiyyah", lines: ["اَشْ = Asy-", "الشَّمْسُ الصَّلَاةَ"], description: "Al- yang masuk (Syamsiyyah)" },
  { book: 5, page: 12, category: 'exercise', title: "Latihan Al- Syamsiyyah 1", lines: ["الرَّحْمَنُ الرَّحِيمُ", "التَّوَّابُ الذِّكْرُ", "الصَّمَدُ الصِّرَاطَ"], description: "Latihan Alif Lam Syamsiyyah" },
  { book: 5, page: 13, category: 'exercise', title: "Latihan Al- Syamsiyyah 2", lines: ["النَّاسُ الشَّمْسُ", "الضُّحَى الطَّارِقُ", "الظَّالِمِينَ الزَّكَاةَ"], description: "Al- Syamsiyyah dalam kata" },
  { book: 5, page: 14, category: 'review', title: "Review Alif Lam", lines: ["وَالشَّمْسِ وَضُحَاهَا", "وَالْقَمَرِ إِذَا تَلَاهَا", "وَالنَّهَارِ إِذَا جَلَّاهَا"], description: "Gabungan Qamariyyah & Syamsiyyah" },
  
  // Mad Wajib & Jaiz (hal 15-18)
  { book: 5, page: 15, category: 'lesson', title: "Mad Wajib Muttashil", lines: ["جَاءَ شَاءَ", "السَّمَاءِ مَاءً"], description: "Mad Wajib (4-5 harakat)" },
  { book: 5, page: 16, category: 'exercise', title: "Latihan Mad Wajib", lines: ["يَشَاءُ جَاءَكُمْ", "بِنَاءً أَسْمَاءَ", "يَوْمَ جَاءَهُمْ"], description: "Latihan Mad Wajib Muttashil" },
  { book: 5, page: 17, category: 'lesson', title: "Mad Jaiz Munfashil", lines: ["مَا أُنْزِلَ وَمَا أَدْرَاكَ", "إِنَّا أَعْطَيْنَاكَ"], description: "Mad Jaiz (2-5 harakat)" },
  { book: 5, page: 18, category: 'exercise', title: "Latihan Mad Jaiz", lines: ["إِنَّا أَنْزَلْنَاهُ", "بِمَا أُنْزِلَ", "فِي أَنْفُسِكُمْ"], description: "Latihan Mad Jaiz Munfashil" },
  
  // Mad dengan Ya (hal 19-20)
  { book: 5, page: 19, category: 'lesson', title: "Mad dengan Ya", lines: ["يَا أَيُّهَا", "يَا بَنِيَّ"], description: "Mad pada panggilan" },
  { book: 5, page: 20, category: 'exercise', title: "Latihan Mad Ya", lines: ["يَا أَيُّهَا النَّبِيُّ", "يَا أَيُّهَا الَّذِينَ آمَنُوا", "يَا بَنِي إِسْرَائِيلَ"], description: "Mad Ya dalam ayat" },
  
  // Cara Waqaf (hal 21-26)
  { book: 5, page: 21, category: 'lesson', title: "Cara Waqaf", lines: ["Waqaf = Berhenti", "Harakat hilang jadi sukun"], description: "Pengenalan Waqaf" },
  { book: 5, page: 22, category: 'lesson', title: "Waqaf Tanwin Dhammah", lines: ["خَيْرٌ → خَيْرْ", "قَدِيرٌ → قَدِيرْ", "عَلِيمٌ → عَلِيمْ"], description: "Tanwin ٌ jadi sukun" },
  { book: 5, page: 23, category: 'lesson', title: "Waqaf Tanwin Kasrah", lines: ["شَيْءٍ → شَيْءْ", "قَوْمٍ → قَوْمْ", "كِتَابٍ → كِتَابْ"], description: "Tanwin ٍ jadi sukun" },
  { book: 5, page: 24, category: 'lesson', title: "Waqaf Tanwin Fathah", lines: ["حِسَابًا → حِسَابَا", "كِتَابًا → كِتَابَا", "مَاءً → مَاءَا"], description: "Tanwin ًا jadi Alif" },
  { book: 5, page: 25, category: 'lesson', title: "Waqaf Ta Marbuthah", lines: ["رَحْمَةً → رَحْمَهْ", "جَنَّةً → جَنَّهْ", "مَرْفُوعَةٌ → مَرْفُوعَهْ"], description: "Ta Marbuthah jadi Ha sukun" },
  { book: 5, page: 26, category: 'exercise', title: "Latihan Waqaf", lines: ["عَلَيْهِ → عَلَيْهْ", "الْمُسْتَقِيمَ → الْمُسْتَقِيمْ", "الرَّحِيمِ → الرَّحِيمْ"], description: "Latihan cara Waqaf" },
  
  // Latihan Waqaf dengan ayat (hal 27-29)
  { book: 5, page: 27, category: 'exercise', title: "Latihan Waqaf 1", lines: ["فَسَبِّحْ بِحَمْدِ رَبِّكَ", "إِنَّهُ كَانَ تَوَّابًا", "وَأَنْتَ حَمِيدٌ مَجِيدٌ"], description: "Waqaf dalam bacaan" },
  { book: 5, page: 28, category: 'exercise', title: "Latihan Waqaf 2", lines: ["إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", "وَهُوَ السَّمِيعُ الْعَلِيمُ", "رَبِّ الْعَالَمِينَ"], description: "Waqaf pada sifat Allah" },
  { book: 5, page: 29, category: 'exercise', title: "Latihan Waqaf 3", lines: ["صِرَاطَ الَّذِينَ أَنْعَمْتَ", "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ", "وَلَا الضَّالِّينَ"], description: "Waqaf Al-Fatihah" },
  
  // Surah Al-Kautsar & Al-Maun (hal 30-32)
  { book: 5, page: 30, category: 'exercise', title: "Surah Al-Kautsar", lines: ["إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", "فَصَلِّ لِرَبِّكَ وَانْحَرْ", "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ"], description: "Bacaan Al-Kautsar lengkap" },
  { book: 5, page: 31, category: 'exercise', title: "Surah Al-Maun (1)", lines: ["أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", "فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", "وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ"], description: "Al-Maun ayat 1-3" },
  { book: 5, page: 32, category: 'review', title: "Surah Al-Maun (2)", lines: ["فَوَيْلٌ لِلْمُصَلِّينَ", "الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ", "الَّذِينَ هُمْ يُرَاءُونَ وَيَمْنَعُونَ الْمَاعُونَ"], description: "Al-Maun ayat 4-7 & Penutup Iqra 5" },

  // ==========================================
  // IQRA 6: Hukum Tajwid Lengkap (32 halaman)
  // ==========================================
  
  { book: 6, page: 1, category: 'cover', title: "Cover Iqra 6", lines: ["إِقْرَأْ ٦"], description: "Cover buku Iqra 6" },
  { book: 6, page: 2, category: 'intro', title: "Pengenalan", lines: ["Hukum Tajwid", "Nun Mati & Tanwin"], description: "Petunjuk Iqra 6" },
  
  // Izhar Halqi (hal 3-4)
  { book: 6, page: 3, category: 'lesson', title: "Izhar Halqi", lines: ["نْ/ً ٍ ٌ + ء ه ع ح غ خ", "مِنْ هُمْ أَنْعَمْتَ"], description: "Izhar: dibaca jelas" },
  { book: 6, page: 4, category: 'exercise', title: "Latihan Izhar", lines: ["عَذَابٌ أَلِيمٌ", "سَلَامٌ هِيَ", "مَنْ عَمِلَ صَالِحًا"], description: "Latihan Izhar Halqi" },
  
  // Idgham Bi Ghunnah (hal 5-6)
  { book: 6, page: 5, category: 'lesson', title: "Idgham Bi Ghunnah", lines: ["نْ/ً ٍ ٌ + ي ن م و", "مَنْ يَقُولُ"], description: "Idgham dengan dengung" },
  { book: 6, page: 6, category: 'exercise', title: "Latihan Idgham Bi Ghunnah", lines: ["مِنْ وَالٍ مِنْ نُورٍ", "عَمَّا يَعْمَلُونَ", "يَوْمَئِذٍ نَاعِمَةٌ"], description: "Latihan Idgham dengan ghunnah" },
  
  // Idgham Bila Ghunnah (hal 7-8)
  { book: 6, page: 7, category: 'lesson', title: "Idgham Bila Ghunnah", lines: ["نْ/ً ٍ ٌ + ل ر", "مِنْ لَدُنْهُ"], description: "Idgham tanpa dengung" },
  { book: 6, page: 8, category: 'exercise', title: "Latihan Idgham Bila Ghunnah", lines: ["مِنْ رَبِّهِمْ", "غَفُورٌ رَحِيمٌ", "هُدًى لِلْمُتَّقِينَ"], description: "Latihan Idgham tanpa ghunnah" },
  
  // Iqlab (hal 9-10)
  { book: 6, page: 9, category: 'lesson', title: "Iqlab", lines: ["نْ/ً ٍ ٌ + ب", "مِنۢ بَعْدِ"], description: "Iqlab: berubah jadi Mim" },
  { book: 6, page: 10, category: 'exercise', title: "Latihan Iqlab", lines: ["أَنۢبِئْهُمْ سَمِيعٌۢ بَصِيرٌ", "عَلِيمٌۢ بِذَاتِ الصُّدُورِ", "مَنۢ bَخِلَ"], description: "Latihan Iqlab" },
  
  // Ikhfa Haqiqi (hal 11-13)
  { book: 6, page: 11, category: 'lesson', title: "Ikhfa Haqiqi", lines: ["نْ/ً ٍ ٌ + 15 huruf", "ص ذ ث ك ج ش ق س d ط ز ف ت ض ظ"], description: "Ikhfa: samar dengan dengung" },
  { book: 6, page: 12, category: 'exercise', title: "Latihan Ikhfa 1", lines: ["أَنْتُمْ مِنْ قَبْلُ", "يُنْفِقُونَ كُنْتُمْ", "مَنْ ذَا الَّذِي"], description: "Latihan Ikhfa Haqiqi" },
  { book: 6, page: 13, category: 'exercise', title: "Latihan Ikhfa 2", lines: ["عَلِيمًا حَكِيمًا", "عَذَابًا أَلِيمًا", "شَيْئًا قَدِيرًا"], description: "Ikhfa pada Tanwin" },
  
  // Hukum Mim Mati (hal 14-17)
  { book: 6, page: 14, category: 'lesson', title: "Hukum Mim Mati", lines: ["مْ + م = Idgham Mutamatsilain", "مْ + ب = Ikhfa Syafawi", "مْ + lainnya = Izhar Syafawi"], description: "3 Hukum Mim Mati" },
  { book: 6, page: 15, category: 'exercise', title: "Idgham Mutamatsilain", lines: ["لَهُمْ مَا يَشَاءُونَ", "عَلَيْهِمْ مَا يَعْمَلُونَ", "لَكُمْ مَا كَسَبْتُمْ"], description: "Mim bertemu Mim" },
  { book: 6, page: 16, category: 'exercise', title: "Ikhfa Syafawi", lines: ["تَرْمِيهِمْ بِحِجَارَةٍ", "وَهُمْ بِالْآخِرَةِ", "رَبَّهُمْ بِكَافِرِينَ"], description: "Mim bertemu Ba" },
  { book: 6, page: 17, category: 'exercise', title: "Izhar Syafawi", lines: ["لَهُمْ عَذَابٌ أَلِيمٌ", "عَلَيْكُمْ أَنْفُسَكُمْ", "لَهُمْ نَصِيبٌ"], description: "Mim bertemu selain Mim & Ba" },
  
  // Qalqalah (hal 18-19)
  { book: 6, page: 18, category: 'lesson', title: "Qalqalah", lines: ["Huruf: ق ط ب ج د", "Sughra (tengah) & Kubra (akhir)"], description: "Qalqalah: memantul" },
  { book: 6, page: 19, category: 'exercise', title: "Latihan Qalqalah", lines: ["يَقْطَعُونَ الْأَرْضَ", "أَحَدٌ وَلَمْ يَكُنْ", "قَدْ أَفْلَحَ"], description: "Latihan Qalqalah Sughra & Kubra" },
  
  // Mad Thabi'i & Mad Far'i (hal 20-25)
  { book: 6, page: 20, category: 'lesson', title: "Mad Thabi'i", lines: ["Mad biasa: 2 harakat", "ا و ي"], description: "Mad asli/pokok" },
  { book: 6, page: 21, category: 'lesson', title: "Mad Wajib Muttashil", lines: ["Mad + Hamzah: 4-5 harakat", "جَاءَ السَّمَاءِ"], description: "Mad wajib dipanjangkan" },
  { book: 6, page: 22, category: 'lesson', title: "Mad Jaiz Munfashil", lines: ["Mad ~ Hamzah: 2-5 harakat", "مَا أَنْزَلْنَا"], description: "Mad boleh panjang/pendek" },
  { book: 6, page: 23, category: 'lesson', title: "Mad Lazim", lines: ["Mad + Tasydid/Sukun: 6 harakat", "الْحَاقَّةُ الضَّالِّينَ"], description: "Mad lazim dipanjangkan" },
  { book: 6, page: 24, category: 'lesson', title: "Mad Aridh Lissukun", lines: ["Mad + Waqaf: 2-6 harakat", "الرَّحِيمِ الْمُسْتَقِيمَ"], description: "Mad karena waqaf" },
  { book: 6, page: 25, category: 'lesson', title: "Mad Layyin & Silah", lines: ["Mad Layyin: وْ يْ", "Mad Silah: هُ هِ"], description: "Mad jenis lain" },
  
  // Tanda Waqaf (hal 26)
  { book: 6, page: 26, category: 'lesson', title: "Tanda Waqaf", lines: ["م = Wajib berhenti", "ج = Boleh", "ز = Boleh sambung", "صلى = Sunnah berhenti", "لا = Jangan berhenti"], description: "Simbol waqaf dalam mushaf" },
  
  // Al-Fatihah (hal 27-28)
  { book: 6, page: 27, category: 'exercise', title: "Surah Al-Fatihah (1)", lines: ["بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "الرَّحْمَنِ الرَّحِيمِ"], description: "Al-Fatihah ayat 1-3" },
  { book: 6, page: 28, category: 'exercise', title: "Surah Al-Fatihah (2)", lines: ["مَالِكِ يَوْمِ الدِّينِ", "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"], description: "Al-Fatihah ayat 4-7" },
  
  // Surah-surah pendek (hal 29-32)
  { book: 6, page: 29, category: 'exercise', title: "Surah Al-Ikhlas", lines: ["قُلْ هُوَ اللَّهُ أَحَدٌ", "اللَّهُ الصَّمَدُ", "لَمْ يَلِدْ وَلَمْ يُولَدْ", "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ"], description: "Bacaan Al-Ikhlas lengkap" },
  { book: 6, page: 30, category: 'exercise', title: "Surah Al-Falaq", lines: ["قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "مِنْ شَرِّ مَا خَلَقَ", "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ"], description: "Bacaan Al-Falaq lengkap" },
  { book: 6, page: 31, category: 'exercise', title: "Surah An-Nas", lines: ["قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "مَلِكِ النَّاسِ", "إِلَهِ النَّاسِ", "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", "مِنَ الْجِنَّةِ وَالنَّاسِ"], description: "Bacaan An-Nas lengkap" },
  { book: 6, page: 32, category: 'review', title: "Penutup Iqra 6", lines: ["رَبَّنَا تَقَبَّلْ مِنَّا", "إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ", "وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"], description: "Doa penutup & Tamat Iqra 1-6" }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Dapatkan semua halaman untuk buku tertentu
 */
export const getIqraByBook = (bookNumber: number): IqraPage[] => {
  return iqraData.filter(page => page.book === bookNumber);
};

/**
 * Dapatkan total halaman untuk buku tertentu
 */
export const getTotalPages = (bookNumber: number): number => {
  return iqraData.filter(page => page.book === bookNumber).length;
};

/**
 * Dapatkan halaman spesifik
 */
export const getPage = (bookNumber: number, pageNumber: number): IqraPage | undefined => {
  return iqraData.find(page => page.book === bookNumber && page.page === pageNumber);
};

/**
 * Dapatkan halaman berdasarkan kategori
 */
export const getPagesByCategory = (bookNumber: number, category: IqraPage['category']): IqraPage[] => {
  return iqraData.filter(page => page.book === bookNumber && page.category === category);
};

/**
 * Cari halaman berdasarkan kata kunci dalam title atau description
 */
export const searchPages = (keyword: string): IqraPage[] => {
  const lowerKeyword = keyword.toLowerCase();
  return iqraData.filter(page => 
    page.title?.toLowerCase().includes(lowerKeyword) ||
    page.description?.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * Dapatkan ringkasan struktur semua buku Iqra
 */
export const getIqraSummary = () => {
  return [1, 2, 3, 4, 5, 6].map(bookNum => ({
    book: bookNum,
    totalPages: getTotalPages(bookNum),
    categories: {
      cover: getPagesByCategory(bookNum, 'cover').length,
      intro: getPagesByCategory(bookNum, 'intro').length,
      lesson: getPagesByCategory(bookNum, 'lesson').length,
      exercise: getPagesByCategory(bookNum, 'exercise').length,
      review: getPagesByCategory(bookNum, 'review').length
    }
  }));
};

/**
 * Navigasi: Dapatkan halaman sebelumnya
 */
export const getPreviousPage = (bookNumber: number, currentPage: number): IqraPage | null => {
  if (currentPage <= 1) return null;
  return getPage(bookNumber, currentPage - 1) || null;
};

/**
 * Navigasi: Dapatkan halaman selanjutnya
 */
export const getNextPage = (bookNumber: number, currentPage: number): IqraPage | null => {
  const totalPages = getTotalPages(bookNumber);
  if (currentPage >= totalPages) return null;
  return getPage(bookNumber, currentPage + 1) || null;
};

// ==========================================
// STATISTIK & INFO
// ==========================================

export const iqraStats = {
  totalBooks: 6,
  totalPages: iqraData.length,
  booksInfo: [
    { book: 1, pages: 47, topic: "Pengenalan Huruf Hijaiyah dengan Fathah" },
    { book: 2, pages: 32, topic: "Huruf Bersambung & Bacaan Panjang (Mad)" },
    { book: 3, pages: 32, topic: "Mad Lanjutan & Tanwin" },
    { book: 4, pages: 32, topic: "Sukun, Qalqalah, Tasydid" },
    { book: 5, pages: 32, topic: "Alif Lam, Waqaf, Mad Lanjutan" },
    { book: 6, pages: 32, topic: "Hukum Tajwid Lengkap" }
  ]
};