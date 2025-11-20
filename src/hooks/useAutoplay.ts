import { useState, useEffect, useCallback, useRef } from 'react';
import type { Surah } from '../types';
import { useAudioPlayer } from '../context/AudioContext';

/**
 * Custom hook to manage the autoplay functionality for Quran recitation.
 * It handles the playback queue, starting, stopping, and progressing through ayahs.
 * @param surah The surah data object.
 * @param highlightAyah The specific ayah number to start from (optional).
 * @param startAutoplay A boolean trigger to start the autoplay feature.
 * @param onAutoplayHandled A callback to signal that the trigger has been processed.
 * @returns An object with controls and state for the autoplay feature.
 */
export const useAutoplay = (
    surah: Surah | null,
    highlightAyah: number | null,
    startAutoplay: boolean,
    onAutoplayHandled?: () => void
) => {
    const [isAutoplayQueueActive, setIsAutoplayQueueActive] = useState(false);
    const [currentAutoplayIndex, setCurrentAutoplayIndex] = useState<number | null>(null);
    const { playTrack, stop, setOnEndedCallback } = useAudioPlayer();

    const autoplayTriggeredRef = useRef(false);

    const stopAutoplay = useCallback(() => {
      setIsAutoplayQueueActive(false);
      setCurrentAutoplayIndex(null);
      stop();
    }, [stop]);

    const start = useCallback(() => {
        if (!surah || surah.ayahs.length === 0) return;
        stop(); // Stop any current track before starting a new queue
        setIsAutoplayQueueActive(true);
        const startIndex = highlightAyah ? surah.ayahs.findIndex(a => a.numberInSurah === highlightAyah) : 0;
        setCurrentAutoplayIndex(startIndex !== -1 ? startIndex : 0);
    }, [surah, highlightAyah, stop]);
    
    const nextAyah = useCallback(() => {
        if (surah && currentAutoplayIndex !== null && currentAutoplayIndex < surah.ayahs.length - 1) {
            setCurrentAutoplayIndex(prev => (prev !== null ? prev + 1 : 0));
        }
    }, [surah, currentAutoplayIndex]);

    const prevAyah = useCallback(() => {
        if (currentAutoplayIndex !== null && currentAutoplayIndex > 0) {
            setCurrentAutoplayIndex(prev => (prev !== null ? prev - 1 : 0));
        }
    }, [currentAutoplayIndex]);
    
    const handleTrackEnd = useCallback(() => {
        if (!isAutoplayQueueActive || !surah) return;
    
        setCurrentAutoplayIndex(prevIndex => {
            if (prevIndex === null) {
                stopAutoplay();
                return null;
            }
            const nextIndex = prevIndex + 1;
            if (nextIndex < surah.ayahs.length) {
                return nextIndex;
            } else {
                stopAutoplay();
                return null;
            }
        });
    }, [isAutoplayQueueActive, surah, stopAutoplay]);

    // Effect to handle the initial trigger from props
    useEffect(() => {
        if (startAutoplay && surah && !autoplayTriggeredRef.current) {
            start();
            autoplayTriggeredRef.current = true;
            onAutoplayHandled?.();
        }
    }, [startAutoplay, surah, onAutoplayHandled, start]);

    // Effect to register the ended callback
    useEffect(() => {
        if (isAutoplayQueueActive) {
            // FIX: Pass the function reference directly, not wrapped in another function.
            setOnEndedCallback(handleTrackEnd);
        }
        return () => {
            setOnEndedCallback(null);
        };
    }, [isAutoplayQueueActive, handleTrackEnd, setOnEndedCallback]);

    // Effect to play the track when the index changes.
    useEffect(() => {
        if (!isAutoplayQueueActive || currentAutoplayIndex === null || !surah) {
            return;
        }

        const ayahToPlay = surah.ayahs[currentAutoplayIndex];
        if (!ayahToPlay) {
            stopAutoplay();
            return;
        }

        const surahNumPadded = String(surah.number).padStart(3, '0');
        const ayahNumPadded = String(ayahToPlay.numberInSurah).padStart(3, '0');
        const audioSrc = `https://everyayah.com/data/Alafasy_128kbps/${surahNumPadded}${ayahNumPadded}.mp3`;
        
        playTrack({
            src: audioSrc,
            title: `S. ${surah.englishName}, Ayat ${ayahToPlay.numberInSurah}`,
            type: 'mp3'
        });
    }, [isAutoplayQueueActive, currentAutoplayIndex, surah, playTrack, stopAutoplay]);


    return { 
        start, 
        stop: stopAutoplay, 
        isPlaying: isAutoplayQueueActive,
        currentlyPlayingAyahIndex: currentAutoplayIndex,
        nextAyah,
        prevAyah,
    };
};