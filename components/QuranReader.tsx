import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Surah, Ayah, Translation } from '../types';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, InformationCircleIcon, QueueListIcon } from './icons/Icons';
import { explainAyah } from '../services/geminiService';
import { useAudioPlayer } from '../context/AudioContext';

// Hardcoded data for Surah Al-Fatihah as a fallback
const fallbackSurah: Surah = {
    number: 1,
    name: "سُورَةُ ٱلْفَاتِحَةِ",
    englishName: "Al-Fatihah",
    englishNameTranslation: "The Opening",
    revelationType: "Meccan",
    ayahs: [
        { number: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", numberInSurah: 1, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false },
        { number: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", numberInSurah: 2, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false },
        { number: 3, text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", numberInSurah: 3, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false },
        { number: 4, text: "مَٰلِكِ يَوْمِ ٱلدِّينِ", numberInSurah: 4, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false },
        { number: 5, text: "إِيَّاكَ نَعْبُd وَإِيَّاكَ نَسْتَعِينُ", numberInSurah: 5, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false },
        { number: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", numberInSurah: 6, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false },
        { number: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", numberInSurah: 7, juz: 1, manzil: 1, page: 1, ruku: 1, hizbQuarter: 1, sajda: false }
    ],
    translations: {
        malay: [
            { text: "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani." },
            { text: "Segala puji tertentu bagi Allah, Tuhan yang memelihara dan mentadbirkan sekalian alam." },
            { text: "Yang Maha Pemurah, lagi Maha Mengasihani." },
            { text: "Yang Menguasai pemerintahan hari Pembalasan (hari Akhirat)." },
            { text: "Engkaulah sahaja (Ya Allah) Yang Kami sembah, dan kepada Engkaulah sahaja kami memohon pertolongan." },
            { text: "Tunjukilah kami jalan yang lurus." },
            { text: "Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan (jalan) orang-orang yang Engkau telah murkai, dan bukan pula (jalan) orang-orang yang sesat." }
        ],
        sahih: [
             { text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
             { text: "[All] praise is [due] to Allah, Lord of the worlds -" },
             { text: "The Entirely Merciful, the Especially Merciful," },
             { text: "Sovereign of the Day of Recompense." },
             { text: "It is You we worship and You we ask for help." },
             { text: "Guide us to the straight path -" },
             { text: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." }
        ]
    }
};


const AyahView: React.FC<{ 
    ayah: Ayah;
    surah: Surah;
    malay: Translation; 
    sahih: Translation; 
    translation: 'malay' | 'sahih' | 'none';
    onExplain: (ayah: Ayah) => void;
    isExpanded: boolean;
    explanation: string | null;
    isExplanationLoading: boolean;
    lastPlayedAyah: number | null;
}> = ({ ayah, surah, malay, sahih, translation, onExplain, isExpanded, explanation, isExplanationLoading, lastPlayedAyah }) => {
    const { track, isPlaying, playTrack, togglePlayPause } = useAudioPlayer();

    const getAudioSrc = useCallback(() => {
        const surahNumPadded = String(surah.number).padStart(3, '0');
        const ayahNumPadded = String(ayah.numberInSurah).padStart(3, '0');
        return `https://everyayah.com/data/Alafasy_128kbps/${surahNumPadded}${ayahNumPadded}.mp3`;
    }, [surah.number, ayah.numberInSurah]);

    const isCurrentTrack = track?.src === getAudioSrc();

    const handlePlay = () => {
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack({
                src: getAudioSrc(),
                title: `S. ${surah.englishName}, Ayat ${ayah.numberInSurah}`,
                type: 'mp3'
            });
        }
    };

    const showExplainButton = isExpanded || (lastPlayedAyah === ayah.number && !isPlaying);
    
    return (
        <div className="py-6 border-b border-border-light dark:border-border-dark">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-primary">{ayah.numberInSurah}</span>
                <div className="flex items-center gap-2">
                    {showExplainButton && (
                         <button
                             onClick={() => onExplain(ayah)}
                             className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-full hover:bg-foreground-light/10 dark:hover:bg-foreground-dark/10 transition-colors text-foreground-light/80 dark:text-foreground-dark/80"
                             aria-label="Jelaskan Ayat"
                         >
                             <InformationCircleIcon className={`w-5 h-5 ${isExpanded ? 'text-primary' : ''}`} />
                             <span>{isExpanded ? 'Sembunyikan' : 'Jelaskan Ayat'}</span>
                         </button>
                     )}
                    <button 
                        onClick={handlePlay}
                        className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors"
                        aria-label={isCurrentTrack && isPlaying ? "Pause audio" : "Play audio"}
                    >
                        {isCurrentTrack && isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <p className="text-right font-arabic text-3xl md:text-4xl leading-relaxed tracking-wide text-foreground-light dark:text-foreground-dark mb-4">
                {ayah.text}
            </p>
            {translation === 'malay' && <p className="text-left text-foreground-light/90 dark:text-foreground-dark/90 mt-4">{malay.text}</p>}
            {translation === 'sahih' && <p className="text-left text-foreground-light/90 dark:text-foreground-dark/90 mt-4">{sahih.text}</p>}
             {isExpanded && (
                <div className="mt-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                    {isExplanationLoading ? (
                        <div className="flex items-center gap-2 text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            <span>Menjana penjelasan...</span>
                        </div>
                    ) : (
                        <div>
                            <h4 className="font-semibold text-sm mb-2 text-primary">Penjelasan Ringkas</h4>
                            <p className="text-sm text-foreground-light/90 dark:text-foreground-dark/90 whitespace-pre-wrap">{explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const QuranReader: React.FC = () => {
    const [surah, setSurah] = useState<Surah | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSurah, setCurrentSurah] = useState(1);
    const [translation, setTranslation] = useState<'malay' | 'sahih' | 'none'>('malay');
    const [explainingAyah, setExplainingAyah] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isExplanationLoading, setIsExplanationLoading] = useState(false);
    const [isAutoplayActive, setAutoplayActive] = useState(false);
    const [lastPlayedAyah, setLastPlayedAyah] = useState<number | null>(null);
    
    const { track, isPlaying, currentTime, duration, playTrack, stop } = useAudioPlayer();
    const autoplayNextSurahRef = useRef(false);

    const toggleAutoplay = () => {
        setAutoplayActive(prev => !prev);
        autoplayNextSurahRef.current = false;
    };

    const resetStates = useCallback(() => {
        stop();
        setExplainingAyah(null);
        setExplanation(null);
        setLastPlayedAyah(null);
    }, [stop]);

    const fetchSurah = useCallback(async (surahNumber: number) => {
        setLoading(true);
        setError(null);
        if(!autoplayNextSurahRef.current) {
            resetStates();
        }

        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ms.basmeih,en.sahih`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.code !== 200) {
                throw new Error(data.status);
            }

            const formattedSurah: Surah = {
                number: data.data[0].number,
                name: data.data[0].name,
                englishName: data.data[0].englishName,
                englishNameTranslation: data.data[0].englishNameTranslation,
                revelationType: data.data[0].revelationType,
                ayahs: data.data[0].ayahs,
                translations: {
                    malay: data.data[1].ayahs.map((a: any) => ({ text: a.text })),
                    sahih: data.data[2].ayahs.map((a: any) => ({ text: a.text })),
                }
            };
            setSurah(formattedSurah);
            
            if (autoplayNextSurahRef.current) {
                autoplayNextSurahRef.current = false;
                const firstAyah = formattedSurah.ayahs[0];
                const surahNumPadded = String(formattedSurah.number).padStart(3, '0');
                const ayahNumPadded = String(firstAyah.numberInSurah).padStart(3, '0');
                playTrack({
                    src: `https://everyayah.com/data/Alafasy_128kbps/${surahNumPadded}${ayahNumPadded}.mp3`,
                    title: `S. ${formattedSurah.englishName}, Ayat ${firstAyah.numberInSurah}`,
                    type: 'mp3'
                });
            }

        } catch (err) {
            console.error("Failed to fetch surah:", err);
            setError("Gagal memuatkan data surah. Memaparkan data luar talian.");
            setSurah(fallbackSurah);
        } finally {
            setLoading(false);
        }
    }, [resetStates, playTrack]);

    const handlePlayNext = useCallback(() => {
        if (!track || !surah) return;

        const match = track.src.match(/(\d{3})(\d{3})\.mp3$/);
        if (!match) return; 

        const currentSurahNum = parseInt(match[1], 10);
        const currentAyahNum = parseInt(match[2], 10);

        if (currentSurahNum !== surah.number) return;

        const nextAyahNumInSurah = currentAyahNum + 1;

        if (nextAyahNumInSurah <= surah.ayahs.length) {
            const nextAyah = surah.ayahs.find(a => a.numberInSurah === nextAyahNumInSurah);
            if (!nextAyah) return;

            const surahNumPadded = String(surah.number).padStart(3, '0');
            const ayahNumPadded = String(nextAyah.numberInSurah).padStart(3, '0');
            const src = `https://everyayah.com/data/Alafasy_128kbps/${surahNumPadded}${ayahNumPadded}.mp3`;

            playTrack({
                src,
                title: `S. ${surah.englishName}, Ayat ${nextAyah.numberInSurah}`,
                type: 'mp3'
            });
        } else {
            if (surah.number < 114) {
                autoplayNextSurahRef.current = true;
                setCurrentSurah(surah.number + 1);
            } else {
                setAutoplayActive(false);
            }
        }
    }, [track, surah, playTrack]);
    
    // Effect to handle track completion
    useEffect(() => {
        const trackFinished = !isPlaying && duration > 0 && Math.abs(currentTime - duration) < 0.5;
        if (trackFinished) {
            if (track && surah) {
                const match = track.title.match(/Ayat (\d+)/);
                if (match) {
                    const finishedAyahNumInSurah = parseInt(match[1], 10);
                    const finishedAyah = surah.ayahs.find(a => a.numberInSurah === finishedAyahNumInSurah);
                    if (finishedAyah) {
                        setLastPlayedAyah(finishedAyah.number);
                    }
                }
            }
            if (isAutoplayActive) {
                handlePlayNext();
            }
        }
    }, [isPlaying, isAutoplayActive, currentTime, duration, handlePlayNext, track, surah]);


    useEffect(() => {
        fetchSurah(currentSurah);
    }, [currentSurah, fetchSurah]);

    useEffect(() => {
        return () => {
           stop();
        }
    }, [stop]);

    const handleExplain = async (ayah: Ayah) => {
        if (explainingAyah === ayah.number) {
            setExplainingAyah(null);
            setLastPlayedAyah(null); // Clear the trigger to prevent the button from reappearing
            return;
        }

        setExplainingAyah(ayah.number);
        setIsExplanationLoading(true);
        setExplanation(null);
        setLastPlayedAyah(ayah.number); // Keep button visible while loading

        const result = await explainAyah(ayah.text, surah?.englishName || '', ayah.numberInSurah);
        setExplanation(result);
        setIsExplanationLoading(false);
    };

    const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSurah(Number(e.target.value));
    };
    
    const goToSurah = (surahNum: number) => {
        if (surahNum >= 1 && surahNum <= 114) {
            setCurrentSurah(surahNum);
        }
    };

    if (loading && !autoplayNextSurahRef.current) {
        return <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-sm mb-6 sticky top-0 z-10">
                {error && <p className="text-center text-sm text-primary mb-2">{error}</p>}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left order-2 sm:order-1">
                        <h2 className="text-2xl font-bold text-primary">{surah?.englishName}</h2>
                        <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80">{surah?.englishNameTranslation}</p>
                    </div>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button onClick={() => goToSurah(currentSurah - 1)} disabled={currentSurah === 1} className="p-2 rounded-md hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50">
                            <ChevronLeftIcon />
                        </button>
                        <select onChange={handleSurahChange} value={currentSurah} className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark border rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary text-foreground-light dark:text-foreground-dark">
                            {Array.from({ length: 114 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>Surah {num}</option>
                            ))}
                        </select>
                        <button onClick={() => goToSurah(currentSurah + 1)} disabled={currentSurah === 114} className="p-2 rounded-md hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50">
                            <ChevronRightIcon />
                        </button>
                    </div>
                    <div className="flex gap-1 p-1 bg-background-light dark:bg-background-dark rounded-lg order-3">
                        <button onClick={toggleAutoplay} className={`p-2 rounded-md ${isAutoplayActive ? 'text-primary bg-card-light dark:bg-card-dark shadow-sm' : ''}`} aria-label="Autoplay">
                            <QueueListIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTranslation('malay')} className={`px-3 py-1 text-sm rounded-md ${translation === 'malay' ? 'bg-card-light dark:bg-card-dark shadow-sm' : ''}`}>Melayu</button>
                        <button onClick={() => setTranslation('sahih')} className={`px-3 py-1 text-sm rounded-md ${translation === 'sahih' ? 'bg-card-light dark:bg-card-dark shadow-sm' : ''}`}>English</button>
                        <button onClick={() => setTranslation('none')} className={`px-3 py-1 text-sm rounded-md ${translation === 'none' ? 'bg-card-light dark:bg-card-dark shadow-sm' : ''}`}>Off</button>
                    </div>
                </div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-4 sm:p-8 rounded-xl shadow-sm">
                {surah && (
                    <div className="text-center mb-8">
                        <p className="font-arabic text-3xl">{surah.name}</p>
                    </div>
                )}
                {surah?.ayahs.map((ayah, index) => (
                    <AyahView 
                        key={ayah.number} 
                        ayah={ayah}
                        surah={surah}
                        malay={surah.translations.malay[index]} 
                        sahih={surah.translations.sahih[index]} 
                        translation={translation}
                        onExplain={handleExplain}
                        isExpanded={explainingAyah === ayah.number}
                        explanation={explainingAyah === ayah.number ? explanation : null}
                        isExplanationLoading={explainingAyah === ayah.number && isExplanationLoading}
                        lastPlayedAyah={lastPlayedAyah}
                    />
                ))}
            </div>
        </div>
    );
};