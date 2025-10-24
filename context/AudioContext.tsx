import React, { createContext, useState, useContext, useRef, useEffect, useCallback, ReactNode } from 'react';
import type { AudioPlayerContextType, AudioTrack } from '../types';
import { createWavBlobUrl } from '../utils/audio';

const AudioContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = (): AudioPlayerContextType => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [track, setTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const blobUrlRef = useRef<string | null>(null);

    const cleanup = useCallback((withError: string | null = null) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setTrack(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setError(withError);
    }, []);

    const playTrack = useCallback((newTrack: AudioTrack) => {
        cleanup(); // Clears previous state and any errors
        
        const audio = new Audio();
        audioRef.current = audio;

        if (newTrack.type === 'wav_base64') {
            const url = createWavBlobUrl(newTrack.src);
            blobUrlRef.current = url;
            audio.src = url;
        } else {
            audio.src = newTrack.src;
        }
        
        audio.volume = volume;

        audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
        audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        audio.addEventListener('ended', () => {
            setIsPlaying(false);
        });
        audio.addEventListener('error', (e) => {
            console.error("Audio play failed:", (e.target as HTMLAudioElement).error);
            cleanup('Audio tidak dapat dimainkan.');
        });

        audio.play().then(() => {
            setTrack(newTrack);
            setIsPlaying(true);
        }).catch(err => {
            console.error("Error playing audio track:", err);
            cleanup('Audio tidak dapat dimainkan.');
        });

    }, [cleanup, volume]);

    const togglePlayPause = useCallback(() => {
        if (!audioRef.current || error) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [isPlaying, error]);

    const seek = useCallback((time: number) => {
        if (audioRef.current && !error) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, [error]);
    
    const skip = useCallback((seconds: number) => {
        if(audioRef.current && !error) {
            const newTime = audioRef.current.currentTime + seconds;
            seek(Math.max(0, Math.min(duration, newTime)));
        }
    }, [duration, seek, error]);

    const setVolume = useCallback((newVolume: number) => {
        setVolumeState(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }, []);

    const stop = useCallback(() => {
        cleanup();
    }, [cleanup]);

    useEffect(() => {
        // Cleanup on unmount
        return () => cleanup();
    }, [cleanup]);

    const value: AudioPlayerContextType = {
        track,
        isPlaying,
        currentTime,
        duration,
        volume,
        error,
        playTrack,
        togglePlayPause,
        seek,
        setVolume,
        skip,
        stop
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};