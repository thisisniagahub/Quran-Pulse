import React, { useState, useEffect, useRef, memo } from 'react';
import type { Ayah, Translation } from '../types';
import { useAudioPlayer } from '../context/AudioContext';
import { getAyahExplanation as getAyahExplanationFromService } from '../services/geminiService';
import { addAyahExplanation, getAyahExplanation as getCachedExplanation } from '../services/dbService';
import { generateSpeech } from '../services/geminiService';
import { Button } from './ui/Button';
import { SpeakerWaveIcon, BookOpenIcon, PlayIcon, StopCircleIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { cn } from '../lib/utils';
import type { Agent } from '../lib/agents';

interface AyahViewProps {
  ayah: Ayah;
  translations: {
    malay: Translation;
    sahih: Translation;
    transliteration: Translation;
  };
  surahName: string;
  surahNumber: number;
  isActive: boolean;
  isAutoplaying: boolean;
  showMalay: boolean;
  showEnglish: boolean;
  showTransliteration: boolean;
  agent: Agent;
}

export const AyahView: React.FC<AyahViewProps> = memo(({ 
    ayah, 
    translations, 
    surahName, 
    surahNumber, 
    isActive, 
    isAutoplaying,
    showMalay,
    showEnglish,
    showTransliteration,
    agent
}) => {
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [isLoadingTafsir, setIsLoadingTafsir] = useState(false);
  const { playTrack, stop, track, isPlaying } = useAudioPlayer();
  const ayahRef = useRef<HTMLDivElement>(null);

  const audioSrc = `https://everyayah.com/data/Alafasy_128kbps/${String(surahNumber).padStart(3, '0')}${String(ayah.numberInSurah).padStart(3, '0')}.mp3`;
  const isCurrentlyPlaying = track?.src === audioSrc && isPlaying;

  useEffect(() => {
    if (isActive || isAutoplaying) {
      ayahRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive, isAutoplaying]);

  const handlePlayAudio = () => {
    if (isCurrentlyPlaying) {
      stop();
    } else {
      playTrack({
        src: audioSrc,
        title: `S. ${surahName}, Ayat ${ayah.numberInSurah}`,
        type: 'mp3'
      });
    }
  };

  const handleToggleTafsir = async () => {
    const newShowState = !showTafsir;
    setShowTafsir(newShowState);

    if (newShowState && !tafsir) {
      setIsLoadingTafsir(true);
      const cacheId = `${surahNumber}:${ayah.numberInSurah}:${agent.id}`;
      
      let explanation = await getCachedExplanation(cacheId);
      
      if (!explanation) {
        explanation = await getAyahExplanationFromService(surahName, ayah.numberInSurah, ayah.text, translations.malay.text, agent);
        
        if (explanation && !explanation.startsWith("Maaf")) {
          await addAyahExplanation(cacheId, explanation);
        }
      }
      
      setTafsir(explanation);
      setIsLoadingTafsir(false);
    }
  };
  
  const handlePlayTafsir = async () => {
    if (tafsir && !isLoadingTafsir) {
        const audioData = await generateSpeech(tafsir);
        if (audioData) {
            playTrack({
                src: audioData,
                title: `Tafsir S. ${surahName}, Ayat ${ayah.numberInSurah}`,
                type: 'wav_base64'
            });
        }
    }
  };

  return (
    <div 
        ref={ayahRef}
        className={cn(
            "p-4 border-b border-border-light dark:border-border-dark transition-colors duration-500",
            (isActive || isAutoplaying) && 'bg-primary/10'
        )}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
            {surahNumber}:{ayah.numberInSurah}
        </span>
        <p dir="rtl" className="font-arabic text-3xl text-right leading-relaxed">
            {ayah.text} <span className="text-primary text-2xl font-sans">۝{ayah.numberInSurah}</span>
        </p>
      </div>

      <div className="space-y-3 mt-4 text-left">
        {showTransliteration && <p className="font-sans text-accent italic">{translations.transliteration.text}</p>}
        {showMalay && <p className="text-foreground-light/80 dark:text-foreground-dark/80">{translations.malay.text}</p>}
        {showEnglish && <p className="text-sm text-foreground-light/70 dark:text-foreground-dark/70 italic">"{translations.sahih.text}"</p>}
      </div>

       <div className="mt-4 flex items-center gap-2">
            <Button onClick={handlePlayAudio} variant="ghost" size="sm" className="gap-2">
                {isCurrentlyPlaying ? <StopCircleIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                {isCurrentlyPlaying ? 'Henti' : 'Dengar'}
            </Button>
            <Button onClick={handleToggleTafsir} variant="ghost" size="sm" className="gap-2">
                <BookOpenIcon className="w-4 h-4" />
                {showTafsir ? 'Tutup Tafsir' : 'Tafsir AI'}
            </Button>
        </div>
      
      {showTafsir && (
         <Card className="mt-4 bg-background-light dark:bg-background-dark">
            <CardContent className="p-4">
                {isLoadingTafsir ? (
                    <p>Memuatkan tafsir...</p>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-primary">Tafsir Ringkas ({agent.name})</h4>
                             <Button onClick={handlePlayTafsir} variant="ghost" size="icon" disabled={!tafsir || tafsir.startsWith("Maaf")}>
                                 <SpeakerWaveIcon className="w-5 h-5"/>
                             </Button>
                        </div>
                        <p className="text-sm">{tafsir}</p>
                    </>
                )}
            </CardContent>
         </Card>
      )}
    </div>
  );
});