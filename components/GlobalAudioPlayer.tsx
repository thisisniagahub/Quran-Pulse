import React from 'react';
import { useAudioPlayer } from '../context/AudioContext';
import { PlayIcon, PauseIcon, StopIcon, XIcon, RefreshIcon } from './icons/Icons';
import { Button } from './ui/Button';

export const GlobalAudioPlayer: React.FC = () => {
    const { track, isPlaying, currentTime, duration, error, togglePlayPause, seek, stop, retry, dismissError } = useAudioPlayer();

    if (!track && !error) {
        return <div className="h-10"></div>; // Maintain layout height
    }

    const formatTime = (time: number) => {
        if (isNaN(time) || time === Infinity) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seek(Number(e.target.value));
    };

    if (error) {
        return (
            <div className="flex items-center gap-2 w-full bg-destructive/10 p-2 rounded-lg">
                <p className="flex-1 text-sm font-semibold text-red-500 truncate">{error}</p>
                <Button onClick={retry} variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10">
                    <RefreshIcon className="w-4 h-4 mr-1" /> Cuba Lagi
                </Button>
                <Button onClick={dismissError} variant="ghost" size="icon" aria-label="Tutup" className="text-red-500 hover:bg-red-500/10">
                    <XIcon className="w-5 h-5" />
                </Button>
            </div>
        );
    }
    
    if (!track) return null;

    return (
        <div className="flex items-center gap-2 w-full">
             <Button onClick={togglePlayPause} variant="ghost" size="icon" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </Button>

            <div className="flex-1 flex flex-col justify-center min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{track.title}</p>
                 <div className="hidden md:flex items-center gap-2 text-xs text-foreground/70">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary border-2 border-border"
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
             <Button onClick={stop} variant="ghost" size="icon" aria-label="Stop playback">
                <StopIcon className="w-5 h-5" />
            </Button>
        </div>
    );
};
