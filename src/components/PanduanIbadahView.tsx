

import React, { useState, useEffect } from 'react';
import type { Guide } from '../types';
import { getCache, setCache } from '../services/dbService';
import { BookOpenIcon, ChevronLeftIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { Skeleton } from './ui/Skeleton';

const PanduanIbadahSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
             <Card key={i}>
                <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
);

export const PanduanIbadahView: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cachedData = await getCache('panduanIbadahData');
        if (cachedData) {
          setGuides(cachedData);
        } else {
          const response = await fetch('/data/panduanIbadahData.json');
          const data = await response.json();
          setGuides(data);
          await setCache('panduanIbadahData', data);
        }
      } catch (error) {
        console.error("Failed to load Panduan Ibadah data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (selectedGuide) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setSelectedGuide(null)} className="flex items-center gap-2 mb-4 font-semibold text-primary hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Kembali ke Senarai
        </button>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-6">{selectedGuide.title}</h2>
            <div className="space-y-4">
                {selectedGuide.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                        </div>
                        <div>
                            <h4 className="font-bold">{step.title}</h4>
                            <p className="text-foreground-light/80 dark:text-foreground-dark/80">{step.description}</p>
                        </div>
                    </div>
                ))}
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
          <BookOpenIcon className="w-8 h-8" />
          Panduan Ibadah
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Rujukan langkah demi langkah untuk amalan harian.</p>
      </div>
      {isLoading ? (
        <PanduanIbadahSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map(guide => (
            <Card key={guide.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedGuide(guide)}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">{guide.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanduanIbadahView;