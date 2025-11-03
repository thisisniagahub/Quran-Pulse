import React, { useState } from 'react';
import { surahListData } from '../data/surahListData';
import { AyahView } from './AyahView';
import { useQuranData } from '../hooks/useQuranData';
import { AGENT_DEFINITIONS } from '../lib/agents';
import { BookMarkedIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { AgentSelector } from './ui/AgentSelector';
import type { Agent } from '../lib/agents';

type AgentId = 'gemini' | 'glm';

export const TafsirView: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const { surah, loading, error } = useQuranData(selectedSurah);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');

  const agentSet = AGENT_DEFINITIONS.tafsir;
  const activeAgent: Agent = agentSet[selectedAgentId];
  
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSurah(Number(e.target.value));
    setSelectedAyah(null); // Reset ayah selection
  };

  const handleAyahClick = (ayahNumber: number) => {
    setSelectedAyah(ayahNumber === selectedAyah ? null : ayahNumber);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <BookMarkedIcon className="w-8 h-8" />
          Tafsir Al-Quran
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Pilih surah untuk memulakan bacaan dan melihat tafsir.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="surah-select" className="block text-sm font-medium mb-1">Pilih Surah</label>
              <select
                id="surah-select"
                value={selectedSurah}
                onChange={handleSurahChange}
                className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
              >
                {surahListData.map(s => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} ({s.name})
                  </option>
                ))}
              </select>
            </div>
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

      {loading && <div className="text-center p-8">Memuatkan surah...</div>}
      {error && <div className="text-center p-8 text-primary">{error}</div>}
      
      {surah && (
        <Card>
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
                isActive={selectedAyah === ayah.numberInSurah}
                isAutoplaying={false} // Autoplay not needed here
                showMalay={true}
                showEnglish={false}
                showTransliteration={true}
                agent={activeAgent}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};