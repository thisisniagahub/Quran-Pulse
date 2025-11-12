import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { AudioContextType, AudioTrack } from '../types';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRateState] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop and clean up the audio element
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Setting src to empty string is a common way to force unload
      audioRef.current.src = ''; 
      audioRef.current.load();
      audioRef.current = null;
    }
    setTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Effect to manage event listeners for the audio element.
  // This is the source of truth for the player's state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      // Ensure the slider visually completes
      if (audio.duration) {
        setCurrentTime(audio.duration);
      }
    };
    const onError = (e: Event) => {
      console.error('Audio Player Error:', e);
      setError('Ralat memuatkan audio. Sila cuba lagi.');
      setIsPlaying(false); // Ensure isPlaying is false on error
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [track]); // Re-attach listeners when the track (and thus audio element) changes

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
        audioRef.current.playbackRate = rate;
    }
  }, []);

  const playTrack = useCallback(async (newTrack: AudioTrack) => {
    // If the same track is requested, just play/pause
    if (audioRef.current && track?.src === newTrack.src && !error) {
      if (audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            console.error("Error resuming track:", err);
            setError("Gagal menyambung main audio.");
          }
        }
      }
      return;
    }

    // Clean up previous track if any
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setError(null);
    setTrack(newTrack);
    setCurrentTime(0); // Reset time for new track

    const audio = new Audio();
    if (newTrack.type === 'wav_base64') {
        audio.src = `data:audio/wav;base64,${newTrack.src}`;
    } else {
        audio.src = newTrack.src;
    }
    audio.playbackRate = playbackRate;
    audioRef.current = audio;

    try {
        await audio.play();
    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.log('Playback aborted by new request.');
        } else {
            console.error("Error playing track:", err);
            setError("Gagal memainkan audio.");
        }
    }
  }, [track, error, playbackRate]);
  
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    
    try {
        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.log('Play/Pause action was interrupted by another action. This is normal.');
        } else {
            console.error("Toggle play/pause failed", err);
            setError("Gagal menukar status main/jeda audio.");
        }
    }
  }, [error]);
  
  const seek = useCallback((time: number) => {
    if (audioRef.current && !error) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [error]);
  
  const retry = useCallback(() => {
    if (track) {
        const trackToRetry = { ...track };
        // Don't call stop() as it clears the track state
        setError(null);
        // Defer playTrack to allow state to update
        setTimeout(() => playTrack(trackToRetry), 50);
    }
  }, [track, playTrack]);

  const dismissError = useCallback(() => {
      setError(null);
      stop(); // Stop completely and clear track
  }, [stop]);

  useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const value: AudioContextType = {
    track,
    isPlaying,
    currentTime,
    duration,
    error,
    playbackRate,
    playTrack,
    togglePlayPause,
    stop,
    seek,
    retry,
    dismissError,
    setPlaybackRate,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudioPlayer = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};