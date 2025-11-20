import React, { useState, useEffect, useRef, memo } from 'react';
import type { Ayah, Translation } from '../types';
import { useAudioPlayer } from '../context/AudioContext';
import { getAyahExplanation as getAyahExplanationFromService } from '../services/geminiService';
import { addAyahExplanation, getAyahExplanation as getCachedExplanation } from '../services/dbService';
import { getTafsirRingkas } from '../services/tafsirService';
import { generateSpeech } from '../services/geminiService';
import { Button } from './ui/Button';
import { SpeakerWaveIcon, BookOpenIcon, PlayIcon, StopCircleIcon, Share2Icon, BookMarkedIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { cn } from '../lib/utils';
import type { Agent } from '../lib/agents';
import { useToast } from '../context/ToastContext';

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
  
  const [showQuickTafsir, setShowQuickTafsir] = useState(false);
  const [quickTafsir, setQuickTafsir] = useState<string | null>(null);
  const [isLoadingQuickTafsir, setIsLoadingQuickTafsir] = useState(false);
  
  const { playTrack, stop, track, isPlaying } = useAudioPlayer();
  const { addToast } = useToast();
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
    if (newShowState) setShowQuickTafsir(false); // Close the other tafsir

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

  const handleToggleQuickTafsir = async () => {
    const newShowState = !showQuickTafsir;
    setShowQuickTafsir(newShowState);
    if (newShowState) setShowTafsir(false); // Close the other tafsir

    if (newShowState && !quickTafsir) {
        setIsLoadingQuickTafsir(true);
        const tafsirText = await getTafsirRingkas(surahNumber, ayah.numberInSurah);
        setQuickTafsir(tafsirText);
        setIsLoadingQuickTafsir(false);
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

  const handleShare = async () => {
    const shareText = `"${ayah.text}"\n\n"${translations.malay.text}"\n\n- Surah ${surahName}, Ayat ${ayah.numberInSurah}\n\nDikongsi melalui aplikasi QuranPulse.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `QuranPulse: ${surahName} ${surahNumber}:${ayah.numberInSurah}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        addToast({ type: 'info', title: 'Disalin!', description: 'Ayat telah disalin ke papan klip.' });
      } catch (err) {
        addToast({ type: 'error', title: 'Kongsi Gagal', description: 'Fungsi kongsi tidak disokong pada pelayar ini.' });
      }
    }
  };

  return (
    <div 
        ref={ayahRef}
        className={cn(
            "border-b border-white/20 p-4 transition-all duration-300 rounded-lg",
            (isActive || isAutoplaying) && 'bg-white/10',
            isAutoplaying && 'animate-subtle-glow'
        )}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-sm bg-primary/80 text-primary-foreground px-3 py-1 rounded-full">
            {surahNumber}:{ayah.numberInSurah}
        </span>
        <p dir="rtl" className="font-arabic text-3xl md:text-4xl text-right leading-relaxed md:leading-loose antialiased">
            {ayah.text} <span className="text-primary text-2xl font-sans">۝{ayah.numberInSurah}</span>
        </p>
      </div>

      <div className="space-y-3 mt-4 text-left">
        {showTransliteration && <p className="font-sans text-foreground/80 italic">{translations.transliteration.text}</p>}
        {showMalay && <p className="text-foreground/80">{translations.malay.text}</p>}
        {showEnglish && <p className="text-sm text-foreground/70 italic">"{translations.sahih.text}"</p>}
      </div>

       <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Button onClick={handlePlayAudio} variant="ghost" size="sm" className="gap-2">
                {isCurrentlyPlaying ? <StopCircleIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                {isCurrentlyPlaying ? 'Henti' : 'Dengar'}
            </Button>
            <Button onClick={handleToggleQuickTafsir} variant="ghost" size="sm" className="gap-2">
                <BookMarkedIcon className="w-4 h-4" />
                {showQuickTafsir ? 'Tutup Ringkasan' : 'Tafsiran Cepat'}
            </Button>
            <Button onClick={handleToggleTafsir} variant="ghost" size="sm" className="gap-2">
                <BookOpenIcon className="w-4 h-4" />
                {showTafsir ? 'Tutup Tafsir' : 'Tafsir AI'}
            </Button>
            <Button onClick={handleShare} variant="ghost" size="sm" className="gap-2">
                <Share2Icon className="w-4 h-4" />
                Kongsi
            </Button>
        </div>

        {/* Quick Tafsir (JAKIM) Panel */}
        <div className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            showQuickTafsir ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        )}>
         <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
                {isLoadingQuickTafsir ? (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>Memuatkan...</span>
                    </div>
                ) : (
                    <>
                        <h4 className="font-bold text-blue-300">Tafsiran Cepat (JAKIM)</h4>
                        <p className="text-sm whitespace-pre-line mt-2">{quickTafsir}</p>
                    </>
                )}
            </CardContent>
         </Card>
      </div>
      
        {/* AI Tafsir Panel */}
        <div className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            showTafsir ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        )}>
         <Card>
            <CardContent className="p-4">
                {isLoadingTafsir ? (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>Memuatkan tafsir...</span>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-primary">Tafsir Ringkas ({agent.name})</h4>
                             <Button onClick={handlePlayTafsir} variant="ghost" size="icon" disabled={!tafsir || tafsir.startsWith("Maaf")}>
                                 <SpeakerWaveIcon className="w-5 h-5"/>
                             </Button>
                        </div>
                        <p className="text-sm whitespace-pre-line">{tafsir}</p>
                    </>
                )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
});
