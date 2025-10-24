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

    // Effect for initializing and cleaning up the single audio element
    useEffect(() => {
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);
        const handleError = () => {
            const mediaError = audio.error;
            console.error("Audio play failed:", mediaError);
            if (mediaError) {
                console.error(`Error code: ${mediaError.code}, Message: ${mediaError.message}`);
            }
            setTrack(null);
            setIsPlaying(false);
            setError('Audio tidak dapat dimainkan.');
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        
        // Cleanup function
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
        };
    }, []);

    const playTrack = useCallback((newTrack: AudioTrack) => {
        if (!audioRef.current) return;

        setError(null);
        setCurrentTime(0);
        setDuration(0);
        setTrack(newTrack);

        const audio = audioRef.current;
        audio.volume = volume;

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }

        let audioSrc = newTrack.src;
        if (newTrack.type === 'wav_base64') {
            try {
                const url = createWavBlobUrl(newTrack.src);
                blobUrlRef.current = url;
                audioSrc = url;
            } catch (e) {
                console.error("Error creating WAV blob URL:", e);
                setError("Gagal memproses audio.");
                return;
            }
        }
        
        if (audio.src !== audioSrc) {
            audio.src = audioSrc;
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                // The 'error' event listener will handle the state update
                console.error("Error starting audio track:", err);
            });
        }
    }, [volume]);
    
    const togglePlayPause = useCallback(() => {
        if (!audioRef.current || !track || error) return;
        
        if (audioRef.current.paused) {
            audioRef.current.play().catch(err => {
                console.error("Error resuming audio track:", err);
            });
        } else {
            audioRef.current.pause();
        }
    }, [track, error]);

    const seek = useCallback((time: number) => {
        if (audioRef.current && isFinite(time)) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);
    
    const skip = useCallback((seconds: number) => {
        if (audioRef.current && isFinite(duration)) {
            const newTime = audioRef.current.currentTime + seconds;
            seek(Math.max(0, Math.min(duration, newTime)));
        }
    }, [duration, seek]);

    const setVolume = useCallback((newVolume: number) => {
        setVolumeState(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            // audioRef.current.src = ''; // This causes a race condition and "Empty src" errors.
        }
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setTrack(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setError(null);
    }, []);

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