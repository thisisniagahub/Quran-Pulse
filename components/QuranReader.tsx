import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuranData } from '../hooks/useQuranData';
import { useAutoplay } from '../hooks/useAutoplay';
import { surahListData } from '../data/surahListData';
import { AyahView } from './AyahView';
import { Button } from './ui/Button';
import { PlayIcon, StopCircleIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { AgentSelector } from './ui/AgentSelector';
import { AGENT_DEFINITIONS } from '../lib/agents';
import type { Agent } from '../lib/agents';

type AgentId = 'gemini' | 'glm';

interface QuranReaderProps {
  initialSurah?: number;
  highlightAyah?: number | null;
  startAutoplay?: boolean;
  onAutoplayHandled?: () => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  initialSurah = 1,
  highlightAyah = null,
  startAutoplay = false,
  onAutoplayHandled
}) => {
  const [selectedSurah, setSelectedSurah] = useState(initialSurah);
  const { surah, loading, error } = useQuranData(selectedSurah);
  
  const { 
      start: startAutoplayQueue, 
      stop: stopAutoplayQueue, 
      isPlaying: isAutoplayActive, 
      currentlyPlayingAyahIndex 
  } = useAutoplay(surah, highlightAyah, startAutoplay, onAutoplayHandled);
  
  const [isSurahListOpen, setSurahListOpen] = useState(false);
  const [showMalay, setShowMalay] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');
  const surahListRef = useRef<HTMLDivElement>(null);

  const agentSet = AGENT_DEFINITIONS.tafsir;
  const activeAgent: Agent = agentSet[selectedAgentId];

  const activeAyahInSurah = useMemo(() => {
    if (!isAutoplayActive || currentlyPlayingAyahIndex === null || !surah) {
        return highlightAyah;
    }
    return surah.ayahs[currentlyPlayingAyahIndex]?.numberInSurah;
  }, [isAutoplayActive, currentlyPlayingAyahIndex, surah, highlightAyah]);

  const handleSurahChange = (surahNumber: number) => {
    if (isAutoplayActive) stopAutoplayQueue();
    setSelectedSurah(surahNumber);
    setSurahListOpen(false);
  };
  
  const handleNextSurah = () => {
      if(selectedSurah < 114) handleSurahChange(selectedSurah + 1);
  }
  
  const handlePrevSurah = () => {
      if(selectedSurah > 1) handleSurahChange(selectedSurah - 1);
  }

  // Close surah list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (surahListRef.current && !surahListRef.current.contains(event.target as Node)) {
        setSurahListOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentSurahInfo = surahListData.find(s => s.number === selectedSurah);

  return (
    <div className="max-w-3xl mx-auto">
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button onClick={handlePrevSurah} disabled={selectedSurah === 1} variant="ghost" size="icon"><ChevronLeftIcon /></Button>
                    
                    <div className="relative flex-1 text-center" ref={surahListRef}>
                        <Button onClick={() => setSurahListOpen(!isSurahListOpen)} variant="secondary" className="w-full sm:w-auto">
                            {currentSurahInfo ? `${currentSurahInfo.number}. ${currentSurahInfo.englishName}` : 'Pilih Surah'}
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        </Button>
                        {isSurahListOpen && (
                            <div className="absolute z-10 top-full mt-2 w-full max-h-60 overflow-y-auto bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg">
                                {surahListData.map(s => (
                                    <div key={s.number} onClick={() => handleSurahChange(s.number)} className="p-3 hover:bg-primary/10 cursor-pointer text-left">
                                        <p className="font-bold">{s.number}. {s.englishName}</p>
                                        <p className="text-sm text-foreground-light/70">{s.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button onClick={handleNextSurah} disabled={selectedSurah === 114} variant="ghost" size="icon"><ChevronRightIcon /></Button>
                </div>
                 <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-center gap-4">
                    <div className="text-center text-sm">
                        <p className="font-semibold">{currentSurahInfo?.englishNameTranslation}</p>
                        <p className="text-foreground-light/70">{currentSurahInfo?.revelationType} • {currentSurahInfo?.numberOfAyahs} Ayat</p>
                    </div>
                     <Button onClick={isAutoplayActive ? stopAutoplayQueue : startAutoplayQueue} variant={isAutoplayActive ? "destructive" : "default"} size="sm">
                        {isAutoplayActive ? <StopCircleIcon className="w-4 h-4 mr-2" /> : <PlayIcon className="w-4 h-4 mr-2" />}
                        {isAutoplayActive ? "Hentikan Main" : "Mainkan Surah"}
                    </Button>
                </div>
                <div className="mt-4 flex justify-center items-center gap-4 text-sm flex-wrap border-t border-border-light dark:border-border-dark pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showMalay} onChange={() => setShowMalay(!showMalay)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span>Terjemahan Melayu</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showEnglish} onChange={() => setShowEnglish(!showEnglish)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span>English Translation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={showTransliteration} onChange={() => setShowTransliteration(!showTransliteration)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span>Transliterasi</span>
                    </label>
                </div>
                 <div className="mt-4 -mb-4">
                    <AgentSelector 
                        agents={Object.values(agentSet)}
                        selectedAgentId={selectedAgentId}
                        onSelectAgent={setSelectedAgentId}
                        title="Pilih Model Tafsir AI"
                    />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            {loading && <div className="text-center p-8">Memuatkan surah...</div>}
            {error && <div className="text-center p-8 text-primary">{error}</div>}
            {surah && (
                <div>
                    <div className="p-4 text-center bg-background-light dark:bg-background-dark">
                         <p className="font-arabic text-3xl">{surah.name}</p>
                         {surah.number !== 1 && surah.number !== 9 && (
                            <p className="font-arabic text-lg mt-2">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                         )}
                    </div>
                    <div>
                        {surah.ayahs.map((ayah, index) => (
                             <AyahView 
                                key={ayah.number}
                                ayah={ayah}
                                translations={{
                                    malay: surah.translations.malay[index],
                                    sahih: surah.translations.sahih[index],
                                    transliteration: surah.translations.transliteration[index]
                                }}
                                surahName={surah.englishName}
                                surahNumber={surah.number}
                                isActive={highlightAyah === ayah.numberInSurah && !isAutoplayActive}
                                isAutoplaying={activeAyahInSurah === ayah.numberInSurah}
                                showMalay={showMalay}
                                showEnglish={showEnglish}
                                showTransliteration={showTransliteration}
                                agent={activeAgent}
                             />
                        ))}
                    </div>
                </div>
            )}
        </Card>
    </div>
  );
};