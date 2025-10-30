import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import type { Surah, Ayah, Translation } from '../types';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, InformationCircleIcon, QueueListIcon, ListBulletIcon, BookIcon } from './icons/Icons';
import { explainAyah } from '../services/geminiService';
import { useAudioPlayer } from '../context/AudioContext';
import { getAyahExplanation, addAyahExplanation } from '../services/dbService';
import { MushafView } from './MushafView';
import { getMushafPageData, TOTAL_MUSHAF_PAGES } from '../data/mushafData';
import { convertToAcademicTransliteration } from '../services/transliterationConverter';
import { useQuranData } from '../hooks/useQuranData';
import { useAutoplay } from '../hooks/useAutoplay';

// P2 OPTIMIZATION: MEMOIZATION
// The AyahView component is wrapped in React.memo. This is a performance optimization that
// prevents the component from re-rendering if its props have not changed. This is very effective
// in long lists where updating one item (e.g., expanding an explanation) doesn't cause
// all other items in the list to re-render.
const AyahView: React.FC<{ 
    ayah: Ayah;
    surah: Surah;
    malay: Translation; 
    sahih: Translation; 
    transliterationText: Translation;
    translation: 'malay' | 'sahih' | 'none';
    setTranslation: (value: 'malay' | 'sahih' | 'none') => void;
    transliterationMode: 'academic' | 'simple' | 'none';
    setTransliterationMode: (value: 'academic' | 'simple' | 'none') => void;
    onExplain: (ayah: Ayah) => void;
    isExpanded: boolean;
    explanation: string | null;
    isExplanationLoading: boolean;
    isAutoplayActive: boolean;
    stopAutoplay: () => void;
    isHighlighted: boolean;
}> = memo(function AyahView({ 
    ayah, surah, malay, sahih, transliterationText, translation, setTranslation, 
    transliterationMode, setTransliterationMode, onExplain, isExpanded, explanation, 
    isExplanationLoading, isAutoplayActive, stopAutoplay, isHighlighted
}) {
    const { track, isPlaying, playTrack, togglePlayPause } = useAudioPlayer();
    const ayahRef = useRef<HTMLDivElement>(null);

    // Logic to save/load translation preference for Al-Baqarah, Ayah 7
    const isTargetAyah = surah.number === 2 && ayah.numberInSurah === 7;
    const translationPrefKey = 'ayah_2_7_translation_preference';

    useEffect(() => {
        if (isTargetAyah) {
            const savedPreference = localStorage.getItem(translationPrefKey);
            if (savedPreference && ['malay', 'sahih', 'none'].includes(savedPreference) && translation !== savedPreference) {
                setTranslation(savedPreference as 'malay' | 'sahih' | 'none');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTargetAyah, translation, setTranslation]);

    const handleSetTranslation = (newTranslation: 'malay' | 'sahih' | 'none') => {
        setTranslation(newTranslation);
        if (isTargetAyah) {
            localStorage.setItem(translationPrefKey, newTranslation);
        }
    };

    useEffect(() => {
        if (isHighlighted && ayahRef.current) {
            ayahRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isHighlighted]);

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
            stopAutoplay();
            playTrack({
                src: getAudioSrc(),
                title: `S. ${surah.englishName}, Ayat ${ayah.numberInSurah}`,
                type: 'mp3'
            });
        }
    };
    
    return (
        <div ref={ayahRef} className={`py-6 border-b border-border-light dark:border-border-dark transition-colors duration-500 ${isHighlighted ? 'bg-primary/10' : ''}`}>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-primary">{ayah.numberInSurah}</span>
                <div className="flex items-center gap-2">
                     <button
                         onClick={() => onExplain(ayah)}
                         className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-full hover:bg-foreground-light/10 dark:hover:bg-foreground-dark/10 transition-colors text-foreground-light/80 dark:text-foreground-dark/80"
                         aria-label="Jelaskan Ayat"
                     >
                         <InformationCircleIcon className={`w-5 h-5 ${isExpanded ? 'text-primary' : ''}`} />
                         <span>{isExpanded ? 'Sembunyikan' : 'Jelaskan Ayat'}</span>
                     </button>
                    <button 
                        onClick={handlePlay}
                        disabled={isAutoplayActive && !isCurrentTrack}
                        className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors disabled:opacity-50"
                        aria-label={isCurrentTrack && isPlaying ? "Pause audio" : "Play audio"}
                    >
                        {isCurrentTrack && isPlaying ? (
                            <PauseIcon className="w-5 h-5" />
                        ) : (
                            <PlayIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            <p className="text-right font-arabic text-3xl md:text-4xl leading-relaxed tracking-wide text-foreground-light dark:text-foreground-dark mb-4">
                {ayah.text}
            </p>
             <div className="mt-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm text-primary">Terjemahan</h4>
                    <div className="flex gap-1 p-0.5 bg-card-light dark:bg-card-dark rounded-full">
                        <button onClick={() => handleSetTranslation('malay')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${translation === 'malay' ? 'bg-primary text-white' : ''}`}>Melayu</button>
                        <button onClick={() => handleSetTranslation('sahih')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${translation === 'sahih' ? 'bg-primary text-white' : ''}`}>English</button>
                        <button onClick={() => handleSetTranslation('none')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${translation === 'none' ? 'bg-primary text-white' : ''}`}>Tutup</button>
                    </div>
                </div>
                {translation === 'malay' && <p className="text-sm text-foreground-light/90 dark:text-foreground-dark/90">{malay.text}</p>}
                {translation === 'sahih' && <p className="text-sm text-foreground-light/90 dark:text-foreground-dark/90">{sahih.text}</p>}
                {translation === 'none' && <p className="text-sm text-center text-foreground-light/60 dark:text-foreground-dark/60 italic py-2">Terjemahan disembunyikan.</p>}
            </div>
            <div className="mt-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm text-accent">Transliterasi</h4>
                    <div className="flex gap-1 p-0.5 bg-card-light dark:bg-card-dark rounded-full">
                        <button onClick={() => setTransliterationMode('academic')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${transliterationMode === 'academic' ? 'bg-accent text-background-dark' : ''}`}>Akademik</button>
                        <button onClick={() => setTransliterationMode('simple')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${transliterationMode === 'simple' ? 'bg-accent text-background-dark' : ''}`}>Rumi</button>
                        <button onClick={() => setTransliterationMode('none')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${transliterationMode === 'none' ? 'bg-accent text-background-dark' : ''}`}>Tutup</button>
                    </div>
                </div>
                {transliterationMode === 'simple' && <p className="text-sm font-sans text-foreground-light/90 dark:text-foreground-dark/90">{transliterationText.text}</p>}
                {transliterationMode === 'academic' && <p className="font-transliteration text-base text-foreground-light/90 dark:text-foreground-dark/90">{convertToAcademicTransliteration(transliterationText.text)}</p>}
                {transliterationMode === 'none' && <p className="text-sm text-center text-foreground-light/60 dark:text-foreground-dark/60 italic py-2">Transliterasi disembunyikan.</p>}
            </div>
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
});


const surahNames = [ "Al-Fatihah", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saf", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas" ];


interface QuranReaderProps {
    initialSurah?: number;
    highlightAyah?: number | null;
    startAutoplay?: boolean;
    onAutoplayHandled?: () => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({ initialSurah = 1, highlightAyah = null, startAutoplay = false, onAutoplayHandled }) => {
    const [selectedSurah, setSelectedSurah] = useState(initialSurah);
    
    // P2 REFACTOR: State management for data fetching and autoplay is now delegated to custom hooks.
    // This makes the QuranReader component much cleaner and more focused on UI.
    const { surah, loading, error } = useQuranData(selectedSurah);
    const { stop, isPlaying, currentlyPlayingAyahIndex, start: startAutoplayQueue } = useAutoplay(surah, highlightAyah, startAutoplay, onAutoplayHandled);

    // State that remains in the component as it's purely for UI control
    const [translation, setTranslation] = useState<'malay' | 'sahih' | 'none'>('malay');
    const [transliteration, setTransliteration] = useState<'academic' | 'simple' | 'none'>('none');
    const [expandedAyah, setExpandedAyah] = useState<number | null>(null);
    const [explanations, setExplanations] = useState<{[key: number]: string}>({});
    const [explanationLoading, setExplanationLoading] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'mushaf'>('list');
    const [mushafPage, setMushafPage] = useState(1);
    const [mushafPageData, setMushafPageData] = useState<any | null>(null);
    
    // Set initial mushaf page when surah loads
    useEffect(() => {
        if(surah?.ayahs.length) {
            setMushafPage(surah.ayahs[0].page);
        }
    }, [surah]);

    const handleExplain = async (ayah: Ayah) => {
        if (expandedAyah === ayah.number) {
            setExpandedAyah(null);
            return;
        }

        setExpandedAyah(ayah.number);

        if (explanations[ayah.number]) return;
        
        const cachedExplanation = await getAyahExplanation(`${surah?.number}:${ayah.numberInSurah}`);
        if(cachedExplanation) {
            setExplanations(prev => ({ ...prev, [ayah.number]: cachedExplanation}));
            return;
        }

        setExplanationLoading(ayah.number);
        try {
            const explanationText = await explainAyah(ayah.text, surah?.englishName || '', ayah.numberInSurah);
            setExplanations(prev => ({...prev, [ayah.number]: explanationText}));
            await addAyahExplanation(`${surah?.number}:${ayah.numberInSurah}`, explanationText);
        } catch (error) {
            setExplanations(prev => ({...prev, [ayah.number]: "Maaf, gagal mendapatkan penjelasan."}));
        } finally {
            setExplanationLoading(null);
        }
    };
    
    const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        stop();
        setSelectedSurah(Number(e.target.value));
    };

    const handleNextSurah = () => {
        if (selectedSurah < 114) {
            stop();
            setSelectedSurah(selectedSurah + 1);
        }
    };

    const handlePrevSurah = () => {
        if (selectedSurah > 1) {
            stop();
            setSelectedSurah(selectedSurah - 1);
        }
    };

    const handleAutoplay = () => {
        if(isPlaying) {
            stop();
        } else {
             startAutoplayQueue();
        }
    };
    
    // Mushaf View Logic
    useEffect(() => {
      if (viewMode === 'mushaf') {
        const data = getMushafPageData(mushafPage);
        setMushafPageData(data);
      }
    }, [mushafPage, viewMode]);

    const handleNextMushafPage = () => {
        if (mushafPage < TOTAL_MUSHAF_PAGES) setMushafPage(p => p + 1);
    }
    
    const handlePrevMushafPage = () => {
        if (mushafPage > 1) setMushafPage(p => p - 1);
    }

    const renderHeader = () => (
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-6 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                 {viewMode === 'list' ? (
                     <div className="flex items-center gap-2">
                        <button onClick={handlePrevSurah} disabled={selectedSurah === 1 || loading} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50"><ChevronLeftIcon /></button>
                        <select value={selectedSurah} onChange={handleSurahChange} disabled={loading} className="bg-transparent text-lg font-bold focus:ring-0 border-0 text-primary w-48 sm:w-64">
                            {surahNames.map((name, index) => (
                                <option key={index + 1} value={index + 1}>{index + 1}. {name}</option>
                            ))}
                        </select>
                        <button onClick={handleNextSurah} disabled={selectedSurah === 114 || loading} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50"><ChevronRightIcon /></button>
                    </div>
                 ) : (
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevMushafPage} disabled={mushafPage === 1} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50"><ChevronLeftIcon /></button>
                        <span className="text-lg font-bold text-primary px-4">Halaman {mushafPage}</span>
                        <button onClick={handleNextMushafPage} disabled={mushafPage === TOTAL_MUSHAF_PAGES} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50"><ChevronRightIcon /></button>
                    </div>
                 )}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 p-1 bg-background-light dark:bg-background-dark rounded-lg">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : ''}`}><ListBulletIcon /></button>
                        <button onClick={() => setViewMode('mushaf')} className={`p-2 rounded-md ${viewMode === 'mushaf' ? 'bg-primary text-white' : ''}`}><BookIcon /></button>
                    </div>
                     <button onClick={handleAutoplay} className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
                        {isPlaying ? <QueueListIcon className="w-5 h-5 animate-pulse" /> : <PlayIcon className="w-5 h-5"/>}
                        <span className="hidden md:inline">Mainkan Audio</span>
                    </button>
                </div>
            </div>
            {surah && viewMode === 'list' && (
                <div className="text-center mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                    <h2 className="text-3xl font-arabic font-bold text-foreground-light dark:text-foreground-dark">{surah.name}</h2>
                    <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80 mt-1">{surah.englishName} • {surah.englishNameTranslation} • {surah.ayahs.length} Ayat • {surah.revelationType}</p>
                </div>
            )}
        </div>
    );
    
    if (loading) {
        return ( <div> {renderHeader()} <div className="text-center p-8">Memuatkan surah...</div> </div> )
    }

    if (error) {
        return ( <div> {renderHeader()} <div className="text-center p-8 text-primary">{error}</div> </div> )
    }

    return (
        <div>
            {renderHeader()}
            
            {viewMode === 'mushaf' ? (
                <MushafView pageData={mushafPageData} />
            ) : surah ? (
                <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl shadow-sm">
                    {surah.ayahs.map((ayah, index) => (
                        <AyahView
                            key={ayah.number}
                            ayah={ayah}
                            surah={surah}
                            malay={surah.translations.malay[index]}
                            sahih={surah.translations.sahih[index]}
                            transliterationText={surah.translations.transliteration[index]}
                            translation={translation}
                            setTranslation={setTranslation}
                            transliterationMode={transliteration}
                            setTransliterationMode={setTransliteration}
                            onExplain={handleExplain}
                            isExpanded={expandedAyah === ayah.number}
                            explanation={explanations[ayah.number] || null}
                            isExplanationLoading={explanationLoading === ayah.number}
                            isAutoplayActive={isPlaying}
                            stopAutoplay={stop}
                            isHighlighted={
                                (highlightAyah !== null && ayah.numberInSurah === highlightAyah && !isPlaying) ||
                                (isPlaying && currentlyPlayingAyahIndex === index)
                            }
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};