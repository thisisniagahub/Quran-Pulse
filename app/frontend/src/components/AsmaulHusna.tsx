
import React, { useState, useMemo, useEffect } from 'react';
import { useAudioPlayer } from '../context/AudioContext';
import { generateSpeech } from '../services/geminiService';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { SpeakerWaveIcon, PlayIcon, StopCircleIcon } from './icons/Icons';
import { getCache, setCache } from '../services/dbService';
import { Skeleton } from './ui/Skeleton';
import type { AsmaulHusna as AsmaulHusnaType } from '../types';
import { useToast } from '../context/ToastContext';

const AsmaulHusnaSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-8 rounded-full" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mt-3" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                    <Skeleton className="h-8 w-32 mt-4" />
                </CardContent>
            </Card>
        ))}
    </div>
);

const AsmaulHusna: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [asmaulHusnaData, setAsmaulHusnaData] = useState<AsmaulHusnaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { playTrack, stop, track, isPlaying } = useAudioPlayer();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cachedData = await getCache('asmaulHusnaData');
        if (cachedData) {
          setAsmaulHusnaData(cachedData);
        } else {
          const response = await fetch('/data/asmaulHusnaData.json');
          const data = await response.json();
          setAsmaulHusnaData(data);
          await setCache('asmaulHusnaData', data);
        }
      } catch (error) {
        console.error("Failed to load Asmaul Husna data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredNames = useMemo(() => {
    if (!asmaulHusnaData) return [];
    return asmaulHusnaData.filter(name =>
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.translation_ms.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, asmaulHusnaData]);

  const handlePlayName = async (name: AsmaulHusnaType) => {
    if (currentlyPlaying === name.number && isPlaying) {
      stop();
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(name.number);
      const audioData = await generateSpeech(name.arabic);
      if (audioData) {
        playTrack({
          src: audioData,
          title: `${name.transliteration} - ${name.translation_ms}`,
          type: 'wav_base64',
        });
      } else {
        addToast({
          type: 'error',
          title: 'Ralat Audio',
          description: 'Gagal memuatkan sebutan untuk nama ini.'
        });
        setCurrentlyPlaying(null);
      }
    }
  };
  
    // Effect to clear the playing state when the track ends naturally
    React.useEffect(() => {
        if (!isPlaying && currentlyPlaying !== null && asmaulHusnaData) {
            const isCurrentTrackFinished = track?.title?.startsWith(asmaulHusnaData.find(n => n.number === currentlyPlaying)?.transliteration || '###');
            if (isCurrentTrackFinished) {
                setCurrentlyPlaying(null);
            }
        }
    }, [isPlaying, currentlyPlaying, track, asmaulHusnaData]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Asmaul Husna</h2>
        <p className="text-foreground/80">Kenali 99 Nama-nama Allah yang Indah.</p>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari nama atau makna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {isLoading ? (
        <AsmaulHusnaSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map(name => {
            const isThisPlaying = currentlyPlaying === name.number && isPlaying;
            return (
              <Card key={name.number} className="flex flex-col">
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{name.number}</span>
                      <p className="font-arabic text-4xl text-right text-primary">{name.arabic}</p>
                    </div>
                    <h3 className="text-xl font-bold mt-3">{name.transliteration}</h3>
                    <p className="text-foreground/80">{name.translation_ms}</p>
                  </div>
                   <Button onClick={() => handlePlayName(name)} variant="ghost" size="sm" className="mt-4 self-start gap-2">
                      {isThisPlaying ? <StopCircleIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
                       {isThisPlaying ? 'Henti' : 'Dengar Sebutan'}
                   </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AsmaulHusna;
