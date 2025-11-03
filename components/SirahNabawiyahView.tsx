import React, { useState } from 'react';
import { sirahNabawiyahData } from '../data/sirahNabawiyahData';
import type { ContentStory } from '../types';
import { BookMarkedIcon, ChevronLeftIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';

export const SirahNabawiyahView: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ContentStory | null>(null);

  if (selectedEvent) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setSelectedEvent(null)} className="flex items-center gap-2 mb-4 font-semibold text-primary hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Kembali ke Senarai Peristiwa
        </button>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
              {selectedEvent.content}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <BookMarkedIcon className="w-8 h-8" />
          Sirah Nabawiyah
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Menelusuri Perjalanan Hidup Rasulullah S.A.W.</p>
      </div>
      <div className="space-y-4">
        {sirahNabawiyahData.map(event => (
          <Card key={event.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedEvent(event)}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-foreground-light/80 dark:text-foreground-dark/80">{event.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};