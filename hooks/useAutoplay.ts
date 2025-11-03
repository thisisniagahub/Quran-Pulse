import { useState, useEffect, useCallback, useRef } from 'react';
// FIX: The error "File 'file:///types.ts' is not a module" is resolved by creating the correct content for types.ts. The import path is correct.
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
    const autoplayHandledRef = useRef(false);

    const start = useCallback(() => {
        if (!surah || surah.ayahs.length === 0) return;
        stop(); // Stop any current track before starting a new queue
        setIsAutoplayQueueActive(true);
        const startIndex = highlightAyah ? surah.ayahs.findIndex(a => a.numberInSurah === highlightAyah) : 0;
        setCurrentAutoplayIndex(startIndex !== -1 ? startIndex : 0);
    }, [surah, highlightAyah, stop]);

    const stopAutoplay = useCallback(() => {
      setIsAutoplayQueueActive(false);
      setCurrentAutoplayIndex(null);
      stop();
    }, [stop]);

    // Effect to trigger the start of autoplay when the prop is received.
    useEffect(() => {
        if (startAutoplay && surah && !autoplayHandledRef.current) {
            start();
            autoplayHandledRef.current = true;
            onAutoplayHandled?.();
        }
    }, [startAutoplay, surah, onAutoplayHandled, start]);

    // Effect to manage the progression of the autoplay queue.
    useEffect(() => {
        if (!isAutoplayQueueActive || currentAutoplayIndex === null || !surah) return;

        const isTrackFinished = !isPlaying && duration > 0 && Math.abs(currentTime - duration) < 0.2;
        
        // Function to play the current ayah in the queue
        const playCurrent = () => {
            const ayahToPlay = surah.ayahs[currentAutoplayIndex];
            if (!ayahToPlay) {
                stopAutoplay();
                return;
            }
            const surahNumPadded = String(surah.number).padStart(3, '0');
            const ayahNumPadded = String(ayahToPlay.numberInSurah).padStart(3, '0');
            playTrack({
                src: `https://everyayah.com/data/Alafasy_128kbps/${surahNumPadded}${ayahNumPadded}.mp3`,
                title: `S. ${surah.englishName}, Ayat ${ayahToPlay.numberInSurah}`,
                type: 'mp3'
            });
        };

        // If the track is null, it's the start of the queue.
        if (track === null) {
            playCurrent();
        } 
        // If a track just finished, move to the next one.
        else if (isTrackFinished) {
            if (currentAutoplayIndex < surah.ayahs.length - 1) {
                setCurrentAutoplayIndex(prev => prev! + 1);
            } else {
                // End of the queue
                stopAutoplay();
            }
        }
    }, [isAutoplayQueueActive, currentAutoplayIndex, surah, track, isPlaying, duration, currentTime, playTrack, stopAutoplay]);
    
    // Effect to play the next track when the index changes
    useEffect(() => {
        if (isAutoplayQueueActive && currentAutoplayIndex !== null && isPlaying === false) {
             const ayahToPlay = surah?.ayahs[currentAutoplayIndex];
             if (!ayahToPlay) return;
             const surahNumPadded = String(surah.number).padStart(3, '0');
             const ayahNumPadded = String(ayahToPlay.numberInSurah).padStart(3, '0');
             const audioSrc = `https://everyayah.com/data/Alafasy_128kbps/${surahNumPadded}${ayahNumPadded}.mp3`;
             
             // Play only if the index has advanced and the correct track isn't already loaded/finished
             if (track?.src !== audioSrc) {
                 playTrack({
                    src: audioSrc,
                    title: `S. ${surah!.englishName}, Ayat ${ayahToPlay.numberInSurah}`,
                    type: 'mp3'
                });
             }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentAutoplayIndex]);


    return { 
        start, 
        stop: stopAutoplay, 
        isPlaying: isAutoplayQueueActive,
        currentlyPlayingAyahIndex: currentAutoplayIndex,
    };
};