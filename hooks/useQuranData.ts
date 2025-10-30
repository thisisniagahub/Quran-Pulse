import { useState, useEffect, useCallback } from 'react';
import type { Surah } from '../types';

// This is the fallback data used if the API call fails.
const fallbackSurah: Surah = {
    number: 1, name: "سُورَةُ ٱلْفَاتِحَةِ", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", revelationType: "Meccan",
    ayahs: [ { number: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", numberInSurah: 1, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }, { number: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", numberInSurah: 2, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }, { number: 3, text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", numberInSurah: 3, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }, { number: 4, text: "مَٰلِكِ يَوْمِ ٱلدِّينِ", numberInSurah: 4, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }, { number: 5, text: "إِيَّاكَ نَعْبُd وَإِيَّاكَ نَسْتَعِينُ", numberInSurah: 5, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }, { number: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", numberInSurah: 6, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }, { number: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", numberInSurah: 7, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false } ],
    translations: { malay: [ { text: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani." }, { text: "Segala puji tertentu bagi Allah, Tuhan yang memelihara dan mentadbirkan sekalian alam." }, { text: "Yang Maha Pemurah, lagi Maha Mengasihani." }, { text: "Yang Menguasai pemerintahan hari Pembalasan (hari Akhirat)." }, { text: "Engkaulah sahaja (Ya Allah) Yang Kami sembah, dan kepada Engkaulah sahaja kami memohon pertolongan." }, { text: "Tunjukilah kami jalan yang lurus." }, { text: "Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang Engkau telah murkai, dan bukan pula (jalan) orang-orang yang sesat." } ], sahih: [ { text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." }, { text: "[All] praise is [due] to Allah, Lord of the worlds -" }, { text: "The Entirely Merciful, the Especially Merciful," }, { text: "Sovereign of the Day of Recompense." }, { text: "It is You we worship and You we ask for help." }, { text: "Guide us to the straight path -" }, { text: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." } ], transliteration: [ { text: "Bismillaahir Rahmaanir Raheem" }, { text: "Alhamdu lillaahi Rabbil 'aalameen" }, { text: "Ar-Rahmaanir-Raheem" }, { text: "Maaliki Yawmid-Deen" }, { text: "Iyyaaka na'budu wa lyyaaka nasta'een" }, { text: "Ihdinas-Siraatal-Mustaqeem" }, { text: "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen" } ] }
};

/**
 * Custom hook to fetch and manage Quran surah data.
 * It handles loading and error states internally.
 * @param surahNumber The number of the surah to fetch (1-114).
 * @returns An object containing the surah data, loading state, and any error message.
 */
export const useQuranData = (surahNumber: number) => {
    const [surah, setSurah] = useState<Surah | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSurah = useCallback(async (number: number) => {
        setLoading(true);
        setError(null);
        setSurah(null);

        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,ms.basmeih,en.sahih,en.transliteration`);
            if (!response.ok) throw new Error('Gagal mendapatkan data surah.');
            
            const data = await response.json();
            if (data.code !== 200) throw new Error(data.status);

            const combinedSurah: Surah = {
                ...data.data[0],
                translations: {
                    malay: data.data[1].ayahs,
                    sahih: data.data[2].ayahs,
                    transliteration: data.data[3].ayahs
                }
            };
            setSurah(combinedSurah);
        } catch (err) {
            console.error(err);
            setError('Tidak dapat memuatkan data. Sila cuba lagi.');
            setSurah(fallbackSurah); // Provide fallback data on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSurah(surahNumber);
    }, [surahNumber, fetchSurah]);

    return { surah, loading, error };
};
