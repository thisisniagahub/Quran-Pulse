import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PracticeMaterial, IqraPage } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, StopIcon, SpeakerWaveIcon } from './icons/Icons';
import { Button } from './ui/Button';
import { useAudioPlayer } from '../context/AudioContext';
import { generateSpeech } from '../services/geminiService';
import { getCachedIqraData, cacheIqraData } from '../services/dbService';

// --- Helper Functions for Progress Persistence ---
const LOCAL_STORAGE_KEY = 'quranPulseIqraProgress';

const saveIqraProgress = (bookNumber: number, pageIndex: number) => {
    try {
        const progress = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        progress[bookNumber] = pageIndex;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error("Failed to save Iqra progress:", error);
    }
};

const loadIqraProgress = (bookNumber: number): number | null => {
    try {
        const progress = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        return progress[bookNumber] !== undefined ? progress[bookNumber] : null;
    } catch (error) {
        console.error("Failed to load Iqra progress:", error);
        return null;
    }
};


// --- InteractiveWord Component ---
const InteractiveWord: React.FC<{ word: string, lineId: number, wordId: number, onWordClick: (lineId: number, wordId: number) => void, isPlaying: boolean, isLoading: boolean }> = 
({ word, lineId, wordId, onWordClick, isPlaying, isLoading }) => {
    return (
        <span 
            onClick={() => onWordClick(lineId, wordId)} 
            className={`cursor-pointer transition-colors duration-200 rounded-md p-1 ${isPlaying ? 'bg-accent text-background-dark' : 'hover:bg-primary/20'} ${isLoading ? 'animate-pulse' : ''}`}
        >
            {word}
        </span>
    );
};


// --- Main IqraBookView Component ---
interface IqraBookViewProps {
    onSelectMaterial: (material: PracticeMaterial) => void;
    onBack: () => void;
}

export const IqraBookView: React.FC<IqraBookViewProps> = ({ onSelectMaterial, onBack }) => {
    const [iqraData, setIqraData] = useState<IqraPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookNumber, setBookNumber] = useState(1);
    const [pageIndex, setPageIndex] = useState(0);

    const [loadingLine, setLoadingLine] = useState<number | null>(null);
    const lineAudioCache = useRef<Map<string, string>>(new Map());
    const [playbackQueue, setPlaybackQueue] = useState<number[]>([]);
    
    const { playTrack, stop, isPlaying, track, currentTime, duration } = useAudioPlayer();

    // Fetch data on mount, with cache-first strategy
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Try fetching from cache
                const cachedData = await getCachedIqraData();
                if (cachedData && cachedData.length > 0) {
                    setIqraData(cachedData);
                    setLoading(false); // Exit loading state early
                    return; // Data found in cache, no need to fetch from network
                }

                // 2. If not in cache, fetch from network
                const response = await fetch('/data/iqraData.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setIqraData(data);
                
                // 3. Cache the newly fetched data for future use
                await cacheIqraData(data);

            } catch (err) {
                setError("Tidak dapat memuatkan data Iqra'. Sila cuba lagi.");
                console.error(err);
            } finally {
                // Ensure loading is set to false even if cached data was found and we returned early.
                // In the cache-hit case, it's already set, but this handles the network case.
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const pagesInBook = iqraData.filter(p => p.book === bookNumber);
    const currentPageData = pagesInBook[pageIndex];
    const trackIdPrefix = `iqra-${bookNumber}-${pageIndex}`;

    // Load progress when book changes
    useEffect(() => {
        const savedPageIndex = loadIqraProgress(bookNumber);
        setPageIndex(savedPageIndex || 0);
    }, [bookNumber]);

    // Save progress when page changes
    useEffect(() => {
        if(currentPageData) {
            saveIqraProgress(bookNumber, pageIndex);
        }
    }, [pageIndex, bookNumber, currentPageData]);

    const handleLinePlayback = useCallback(async (lineIndex: number) => {
        if (!currentPageData) return;
        const lineText = currentPageData.lines[lineIndex];
        const trackId = `${trackIdPrefix}-${lineIndex}`;

        if (isPlaying && track?.title === trackId) {
            stop();
            return;
        }
        stop();
        
        if (lineAudioCache.current.has(trackId)) {
            playTrack({ src: lineAudioCache.current.get(trackId)!, title: trackId, type: 'wav_base64' });
            return;
        }

        setLoadingLine(lineIndex);
        try {
            const audioData = await generateSpeech(lineText);
            if (audioData) {
                lineAudioCache.current.set(trackId, audioData);
                playTrack({ src: audioData, title: trackId, type: 'wav_base64' });
            }
        } finally {
            setLoadingLine(null);
        }
    }, [currentPageData, isPlaying, track, stop, playTrack, trackIdPrefix]);

    const handleWordClick = (lineIndex: number) => {
        handleLinePlayback(lineIndex);
    };
    
    // Autoplay full page
    const handlePlayPage = () => {
        if(playbackQueue.length > 0) {
            setPlaybackQueue([]);
            stop();
            return;
        }
        const lineIndices = currentPageData.lines.map((_, index) => index);
        setPlaybackQueue(lineIndices);
    };

    // Effect to handle queue progression
    useEffect(() => {
        const isTrackFinished = !isPlaying && duration > 0 && Math.abs(currentTime - duration) < 0.2;
        if (playbackQueue.length > 0 && isTrackFinished) {
            setPlaybackQueue(q => q.slice(1));
        }
    }, [isPlaying, currentTime, duration, playbackQueue]);

    // Effect to play next item in queue
    useEffect(() => {
        if (playbackQueue.length > 0 && !isPlaying) {
            handleLinePlayback(playbackQueue[0]);
        }
    }, [playbackQueue, isPlaying, handleLinePlayback]);

    // Navigation
    const goToPage = (index: number) => {
        if (index >= 0 && index < pagesInBook.length) {
            setPageIndex(index);
            stop();
            lineAudioCache.current.clear();
            setPlaybackQueue([]);
        }
    };

    const handleSelectPageForPractice = () => {
      if (currentPageData) {
        onSelectMaterial({
          title: `Iqra' ${currentPageData.book}, Halaman ${currentPageData.page}`,
          content: currentPageData.lines.join('\n'),
          type: 'iqra',
        });
      }
    };
    
    if (loading) return <div className="text-center p-8">Memuatkan data Iqra'...</div>;
    if (error) return <div className="text-center p-8 text-primary">{error}</div>;
    if (!currentPageData) return <div className="text-center p-8">Halaman tidak ditemui.</div>

    return (
    <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Kembali
        </Button>
        <div className="flex justify-center mb-4">
            <div className="flex gap-1 p-1 bg-background-light dark:bg-background-dark rounded-lg">
                {[1, 2, 3, 4, 5, 6].map(num => (
                    <Button key={num} onClick={() => setBookNumber(num)} variant={bookNumber === num ? 'secondary' : 'ghost'} size="sm">Iqra' {num}</Button>
                ))}
            </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">{currentPageData.title || `Iqra' ${bookNumber} - Halaman ${currentPageData.page}`}</h3>
                <div className="flex gap-2">
                    <Button onClick={() => goToPage(pageIndex - 1)} disabled={pageIndex === 0} size="icon" variant="ghost"><ChevronLeftIcon /></Button>
                    <span className="self-center text-sm">{pageIndex + 1} / {pagesInBook.length}</span>
                    <Button onClick={() => goToPage(pageIndex + 1)} disabled={pageIndex === pagesInBook.length - 1} size="icon" variant="ghost"><ChevronRightIcon /></Button>
                </div>
            </div>
             <div dir="rtl" className="font-arabic text-3xl text-right leading-loose space-y-4 p-4 border-y border-border-light dark:border-border-dark">
                {currentPageData.lines.map((line, lineIdx) => (
                    <p key={lineIdx}>
                        {line.split(' ').map((word, wordIdx) => (
                            <InteractiveWord
                                key={wordIdx}
                                word={word}
                                lineId={lineIdx}
                                wordId={wordIdx}
                                onWordClick={() => handleWordClick(lineIdx)}
                                isPlaying={isPlaying && track?.title === `${trackIdPrefix}-${lineIdx}`}
                                isLoading={loadingLine === lineIdx}
                            />
                        ))}
                    </p>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
                 <Button onClick={handlePlayPage} variant="secondary" className="gap-2">
                    {playbackQueue.length > 0 ? <StopIcon/> : <SpeakerWaveIcon />}
                    {playbackQueue.length > 0 ? "Berhenti" : "Dengar Halaman"}
                </Button>
                <Button onClick={handleSelectPageForPractice}>Praktis Dengan Tutor AI</Button>
            </div>
        </div>
    </div>
    );
};