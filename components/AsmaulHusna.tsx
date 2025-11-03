import React, { useState, useMemo } from 'react';
import { asmaulHusnaData } from '../data/asmaulHusnaData';
import { useAudioPlayer } from '../context/AudioContext';
import { generateSpeech } from '../services/geminiService';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { SpeakerWaveIcon, PlayIcon, StopCircleIcon } from './icons/Icons';

const AsmaulHusna: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { playTrack, stop, track, isPlaying } = useAudioPlayer();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  const filteredNames = useMemo(() => {
    return asmaulHusnaData.filter(name =>
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.translation_ms.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handlePlayName = async (name: typeof asmaulHusnaData[0]) => {
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
        alert("Gagal memuatkan audio.");
        setCurrentlyPlaying(null);
      }
    }
  };
  
    // Effect to clear the playing state when the track ends naturally
    React.useEffect(() => {
        if (!isPlaying && currentlyPlaying !== null) {
            const isCurrentTrackFinished = track?.title?.startsWith(asmaulHusnaData.find(n => n.number === currentlyPlaying)?.transliteration || '###');
            if (isCurrentTrackFinished) {
                setCurrentlyPlaying(null);
            }
        }
    }, [isPlaying, currentlyPlaying, track]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Asmaul Husna</h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Kenali 99 Nama-nama Allah yang Indah.</p>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari nama atau makna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary"
        />
      </div>
      
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
                  <p className="text-foreground-light/80 dark:text-foreground-dark/80">{name.translation_ms}</p>
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
    </div>
  );
};

export default AsmaulHusna;
