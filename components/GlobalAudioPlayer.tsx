import React from 'react';
import { useAudioPlayer } from '../context/AudioContext';
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon, InformationCircleIcon } from './icons/Icons';

export const GlobalAudioPlayer: React.FC = () => {
    const { track, isPlaying, currentTime, duration, volume, error, togglePlayPause, seek, setVolume, skip } = useAudioPlayer();

    if (!track && !error) {
        return null; // Don't render anything if there's no active track or error
    }

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const floorSeconds = Math.floor(seconds);
        const min = Math.floor(floorSeconds / 60);
        const sec = floorSeconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const getTrackDisplayName = () => {
        if (error) return "Ralat Audio";
        if (!track) return "";
        if (track.title.startsWith('tts-')) {
            return track.title.includes('ustaz') ? "Jawapan Ustaz AI" : "Jawapan Sobat AI";
        }
        return track.title;
    };

    return (
        <div className="w-full flex items-center gap-3 text-foreground-light dark:text-foreground-dark">
            <div className="flex items-center gap-2">
                <button onClick={() => skip(-10)} disabled={!!error} className="p-1 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><BackwardIcon className="w-5 h-5" /></button>
                <button onClick={togglePlayPause} disabled={!!error} className="p-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                    {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                <button onClick={() => skip(10)} disabled={!!error} className="p-1 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><ForwardIcon className="w-5 h-5" /></button>
            </div>
            
            {error ? (
                <div className="flex-grow flex items-center justify-center gap-2 text-primary">
                    <InformationCircleIcon className="w-5 h-5"/>
                    <span className="text-sm font-semibold">{error}</span>
                </div>
            ) : (
                <>
                    <div className="flex-grow flex items-center gap-3">
                        <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
                        <div className="w-full bg-border-light dark:bg-border-dark rounded-full h-1.5 group">
                            <input
                                type="range"
                                min="0"
                                max={duration || 1}
                                value={currentTime}
                                onChange={(e) => seek(Number(e.target.value))}
                                className="w-full h-full bg-transparent cursor-pointer appearance-none [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                                style={{
                                    background: `linear-gradient(to right, #e63968 ${duration > 0 ? (currentTime / duration) * 100 : 0}%, #415A77 ${duration > 0 ? (currentTime / duration) * 100 : 0}%)`
                                }}
                            />
                        </div>
                        <span className="text-xs w-10">{formatTime(duration)}</span>
                    </div>
                     <div className="hidden md:flex flex-col flex-shrink-0 w-40 ml-2">
                        <span className="text-sm font-semibold truncate" title={getTrackDisplayName()}>{getTrackDisplayName()}</span>
                        <span className="text-xs text-foreground-light/70 dark:text-foreground-dark/70">QuranPulse Audio</span>
                    </div>
                </>
            )}

             <div className="hidden md:flex items-center gap-2 w-32">
                <button onClick={() => setVolume(volume > 0 ? 0 : 1)}>
                    {volume > 0 ? <SpeakerWaveIcon className="w-5 h-5" /> : <SpeakerXMarkIcon className="w-5 h-5" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1.5 bg-border-light dark:bg-border-dark rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    style={{
                        background: `linear-gradient(to right, #e63968 ${volume * 100}%, #415A77 ${volume * 100}%)`
                    }}
                />
            </div>
        </div>
    );
};