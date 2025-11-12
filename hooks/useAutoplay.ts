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
    const { playTrack, stop, track, isPlaying, duration, currentTime } = useAudioPlayer();

    const autoplayTriggeredRef = useRef(false);
    const hasAdvancedOnEndRef = useRef(false); // Ref lock to prevent race conditions on track end

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
            stop();
            setCurrentAutoplayIndex(prev => prev! + 1);
        }
    }, [surah, currentAutoplayIndex, stop]);

    const prevAyah = useCallback(() => {
        if (currentAutoplayIndex !== null && currentAutoplayIndex > 0) {
            stop();
            setCurrentAutoplayIndex(prev => prev! - 1);
        }
    }, [currentAutoplayIndex, stop]);

    // Effect to handle the initial trigger from props
    useEffect(() => {
        if (startAutoplay && surah && !autoplayTriggeredRef.current) {
            start();
            autoplayTriggeredRef.current = true;
            onAutoplayHandled?.();
        }
    }, [startAutoplay, surah, onAutoplayHandled, start]);

    // Effect 1: Responsible for PLAYING the track when the index changes.
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
        
        // Only play if the track is different. Crucially, reset the 'ended' flag for the new track.
        if (track?.src !== audioSrc) {
            hasAdvancedOnEndRef.current = false;
            playTrack({
                src: audioSrc,
                title: `S. ${surah.englishName}, Ayat ${ayahToPlay.numberInSurah}`,
                type: 'mp3'
            });
        }
    }, [isAutoplayQueueActive, currentAutoplayIndex, surah, playTrack, stopAutoplay, track?.src]);

    // Effect 2: Responsible for ADVANCING to the next index when a track finishes.
    useEffect(() => {
        if (!isAutoplayQueueActive || !surah) return;
        
        const isTrackFinished = !isPlaying && duration > 0 && Math.abs(currentTime - duration) < 0.2;

        if (isTrackFinished && !hasAdvancedOnEndRef.current) {
            hasAdvancedOnEndRef.current = true; // Engage lock to prevent this from running again for the same finished track

            const nextIndex = (currentAutoplayIndex ?? -1) + 1;
            if (nextIndex < surah.ayahs.length) {
                setCurrentAutoplayIndex(nextIndex); // This state change will trigger Effect 1
            } else {
                stopAutoplay(); // End of the surah
            }
        }
    }, [isAutoplayQueueActive, isPlaying, duration, currentTime, surah, currentAutoplayIndex, stopAutoplay]);

    return { 
        start, 
        stop: stopAutoplay, 
        isPlaying: isAutoplayQueueActive,
        currentlyPlayingAyahIndex: currentAutoplayIndex,
        nextAyah,
        prevAyah,
    };
};