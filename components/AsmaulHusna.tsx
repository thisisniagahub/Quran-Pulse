import React, { useState, useMemo } from 'react';
import { asmaulHusnaData } from '../data/asmaulHusnaData';
import { useAudioPlayer } from '../context/AudioContext';
import { generateSpeech } from '../services/geminiService';
import { SpeakerWaveIcon, StarIcon } from './icons/Icons';
import { Button } from './ui/Button';

export const AsmaulHusna: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAudio, setLoadingAudio] = useState<number | null>(null);
  const { playTrack, stop, isPlaying, track } = useAudioPlayer();

  const filteredNames = useMemo(() => {
    if (!searchTerm) {
      return asmaulHusnaData;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return asmaulHusnaData.filter(name =>
      name.transliteration.toLowerCase().includes(lowercasedFilter) ||
      name.translation_ms.toLowerCase().includes(lowercasedFilter) ||
      name.arabic.includes(lowercasedFilter)
    );
  }, [searchTerm]);

  const handlePlayName = async (name: typeof asmaulHusnaData[0]) => {
    const trackId = `asmaul-husna-${name.number}`;
    if (isPlaying && track?.title === trackId) {
        stop();
        return;
    }
    
    stop();
    setLoadingAudio(name.number);
    try {
        // We only need the arabic name for pronunciation
        const audioData = await generateSpeech(name.arabic);
        if (audioData) {
            playTrack({ src: audioData, title: trackId, type: 'wav_base64' });
        }
    } catch (error) {
        console.error("Error generating speech for Asmaul Husna:", error);
    } finally {
        setLoadingAudio(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <StarIcon className="w-8 h-8"/> Asmaul Husna
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Kenali 99 Nama Allah yang Maha Indah.</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari nama atau makna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNames.map((name) => (
          <div key={name.number} className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{name.number}</span>
                    <p className="font-arabic text-4xl text-right text-foreground-light dark:text-foreground-dark">{name.arabic}</p>
                </div>
                <h3 className="text-lg font-semibold mt-2">{name.transliteration}</h3>
                <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80">{name.translation_ms}</p>
            </div>
            <div className="mt-4 text-right">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handlePlayName(name)}
                    disabled={loadingAudio === name.number}
                    aria-label={`Dengar sebutan untuk ${name.transliteration}`}
                >
                    {loadingAudio === name.number ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    ) : (
                        <SpeakerWaveIcon className={`w-5 h-5 ${isPlaying && track?.title === `asmaul-husna-${name.number}` ? 'text-primary' : ''}`} />
                    )}
                </Button>
            </div>
          </div>
        ))}
      </div>
       {filteredNames.length === 0 && (
            <div className="text-center py-16 col-span-full">
                <p className="text-foreground-light/70 dark:text-foreground-dark/70">Tiada nama yang sepadan dengan carian anda.</p>
            </div>
        )}
    </div>
  );
};
