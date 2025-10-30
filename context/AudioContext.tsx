import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { AudioContextType, AudioTrack } from '../types';
import { createWavBlobUrl } from '../utils/audio';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentObjectUrl = useRef<string | null>(null);

    const [track, setTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [lastTrack, setLastTrack] = useState<AudioTrack | null>(null);

    const cleanupObjectUrl = useCallback(() => {
        if (currentObjectUrl.current) {
            URL.revokeObjectURL(currentObjectUrl.current);
            currentObjectUrl.current = null;
        }
    }, []);

    useEffect(() => {
        // General cleanup on unmount
        return () => cleanupObjectUrl();
    }, [cleanupObjectUrl]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);
        const handleError = () => {
            console.error('Audio Error:', audio.error);
            setError('Ralat audio: Gagal memuatkan trek.');
            setIsPlaying(false);
            setLastTrack(track);
            setTrack(null);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('loadedmetadata', handleDurationChange);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('loadedmetadata', handleDurationChange);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [track]);

    const dismissError = useCallback(() => {
        setError(null);
        setLastTrack(null);
    }, []);

    const playTrack = useCallback((newTrack: AudioTrack) => {
        const audio = audioRef.current;
        if (!audio) return;

        cleanupObjectUrl();
        dismissError();
        setTrack(newTrack);

        let audioSrc = newTrack.src;
        if (newTrack.type === 'wav_base64') {
            try {
                audioSrc = createWavBlobUrl(newTrack.src);
                currentObjectUrl.current = audioSrc;
            } catch (e) {
                console.error("Error creating WAV blob URL:", e);
                setError("Gagal memproses data audio.");
                setLastTrack(newTrack);
                setTrack(null);
                return;
            }
        }

        audio.src = audioSrc;
        audio.load();
        audio.play().catch(e => {
            console.error('Playback failed:', e);
            setError('Gagal memainkan audio.');
            setLastTrack(newTrack);
            setTrack(null);
        });
    }, [cleanupObjectUrl, dismissError]);

    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !track) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => {
                console.error('Playback failed on toggle:', e);
                setError('Gagal memainkan audio.');
                setLastTrack(track);
                setTrack(null);
            });
        }
    }, [isPlaying, track]);

    const stop = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.removeAttribute('src'); // Use removeAttribute instead of setting to ''
        audio.load();
        
        cleanupObjectUrl();
        setTrack(null);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        dismissError();
    }, [cleanupObjectUrl, dismissError]);

    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (audio && isFinite(time)) {
            audio.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const retry = useCallback(() => {
        if (lastTrack) {
            playTrack(lastTrack);
        }
    }, [lastTrack, playTrack]);

    const value: AudioContextType = {
        track, isPlaying, currentTime, duration, error,
        playTrack, togglePlayPause, stop, seek, retry, dismissError,
    };

    return (
        <AudioContext.Provider value={value}>
            <audio ref={audioRef} />
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioPlayer = (): AudioContextType => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudioPlayer must be used within an AudioProvider');
    }
    return context;
};
