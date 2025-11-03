import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { AudioContextType, AudioTrack } from '../types';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBuffer = useRef<Map<string, HTMLAudioElement>>(new Map()); // Cache for frequently used audio

  // Clean up audio element
  const cleanupAudio = useCallback((audioElement: HTMLAudioElement) => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      audioElement.load();
      URL.revokeObjectURL(audioElement.src); // Clean up object URLs for base64 data
    }
  }, []);

  // Stop and clean up the audio element
  const stop = useCallback(() => {
    if (audioRef.current) {
      cleanupAudio(audioRef.current);
      audioRef.current = null;
    }
    setTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffering(false);
  }, [cleanupAudio]);

  // Effect to manage event listeners for the audio element.
  // This is the source of truth for the player's state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      setBuffering(false);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onEnded = () => {
      setIsPlaying(false);
      setBuffering(false);
      // Ensure the slider visually completes
      if (audio.duration) {
        setCurrentTime(audio.duration);
      }
    };
    const onError = (e: Event) => {
      console.error('Audio Player Error:', e);
      setError('Ralat memuatkan audio. Sila cuba lagi.');
      setIsPlaying(false);
      setBuffering(false);
    };
    const onCanPlay = () => setBuffering(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [track]); // Re-attach listeners when the track (and thus audio element) changes

  // Preload audio to improve performance
  const preloadAudio = useCallback((src: string, type: string): HTMLAudioElement | null => {
    try {
      if (audioBuffer.current.has(src)) {
        return audioBuffer.current.get(src) || null;
      }

      const audio = document.createElement('audio');
      if (type === 'wav_base64') {
        audio.src = `data:audio/wav;base64,${src}`;
      } else {
        audio.src = src;
      }
      
      // Preload metadata only to save bandwidth
      audio.preload = 'metadata';
      audioBuffer.current.set(src, audio);
      return audio;
    } catch (err) {
      console.error('Error preloading audio:', err);
      return null;
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
      cleanupAudio(audioRef.current);
    }
    
    setError(null);
    setBuffering(true);
    setTrack(newTrack);
    setCurrentTime(0); // Reset time for new track

    // Try to use preloaded audio first
    let audio = audioBuffer.current.get(newTrack.src) || null;
    
    if (!audio) {
      audio = new Audio();
      if (newTrack.type === 'wav_base64') {
        audio.src = `data:audio/wav;base64,${newTrack.src}`;
      } else {
        audio.src = newTrack.src;
      }
    } else {
      // Reset the preloaded audio element
      if (newTrack.type === 'wav_base64') {
        audio.src = `data:audio/wav;base64,${newTrack.src}`;
      } else {
        audio.src = newTrack.src;
      }
    }
    
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
  }, [track, error, cleanupAudio]);

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    
    try {
      if (audio.paused) {
        setBuffering(true);
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
        setBuffering(true);
        // Defer playTrack to allow state to update
        setTimeout(() => playTrack(trackToRetry), 50);
    }
  }, [track, playTrack]);

  const dismissError = useCallback(() => {
      setError(null);
      setBuffering(false);
      stop(); // Stop completely and clear track
  }, [stop]);

  // Cleanup audio buffer periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Keep only the most recently used 10 audio elements
      if (audioBuffer.current.size > 10) {
        const entries = Array.from(audioBuffer.current.entries());
        const sorted = entries.sort((a, b) => {
          const audioA = a[1];
          const audioB = b[1];
          // Sort by last played time or some other metric
          return 0; // Simplified - in a real app, you'd track usage
        });
        
        // Remove oldest entries
        for (let i = 0; i < sorted.length - 10; i++) {
          const [src, audio] = sorted[i];
          cleanupAudio(audio);
          audioBuffer.current.delete(src);
        }
      }
    }, 30000); // Clean up every 30 seconds

    return () => clearInterval(interval);
  }, [cleanupAudio]);

  useEffect(() => {
    return () => {
        if (audioRef.current) {
            cleanupAudio(audioRef.current);
            audioRef.current = null;
        }
        // Clean up all buffered audio
        audioBuffer.current.forEach(audio => cleanupAudio(audio));
        audioBuffer.current.clear();
    };
  }, [cleanupAudio]);

  const value: AudioContextType = {
    track,
    isPlaying,
    currentTime,
    duration,
    error,
    playTrack,
    togglePlayPause,
    stop,
    seek,
    retry,
    dismissError,
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