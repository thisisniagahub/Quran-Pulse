import React, { useState, useEffect } from 'react';
import type { ContentStory } from '../types';
import { getCache, setCache } from '../services/dbService';
import { BookMarkedIcon, ChevronLeftIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { Skeleton } from './ui/Skeleton';

const StoryCard: React.FC<{ story: ContentStory; onSelect: () => void }> = ({ story, onSelect }) => (
  <Card className="cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg group" onClick={onSelect}>
    <div className="overflow-hidden rounded-t-xl aspect-video bg-background-light dark:bg-background-dark">
      <img
        src={story.image}
        alt={story.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <CardContent className="p-4">
      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{story.title}</h3>
      <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80 line-clamp-2">{story.summary}</p>
    </CardContent>
  </Card>
);

const StoryCardSkeleton = () => (
  <Card>
    <Skeleton className="h-40 w-full rounded-t-xl rounded-b-none" />
    <CardContent className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-1" />
    </CardContent>
  </Card>
);

const KisahNabiViewSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <StoryCardSkeleton key={i} />)}
    </div>
);


export const KisahNabiView: React.FC = () => {
  const [stories, setStories] = useState<ContentStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<ContentStory | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cachedData = await getCache('kisahNabiData');
        if (cachedData) {
          setStories(cachedData);
        } else {
          const response = await fetch('/data/kisahNabiData.json');
          const data = await response.json();
          setStories(data);
          await setCache('kisahNabiData', data);
        }
      } catch (error) {
        console.error("Failed to load Kisah Nabi data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
                <BookMarkedIcon className="w-8 h-8" />
                Kisah Para Nabi & Rasul
                </h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Ambil iktibar daripada perjalanan hidup utusan Allah.</p>
            </div>
            <KisahNabiViewSkeleton />
        </div>
    );
  }

  if (selectedStory) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setSelectedStory(null)} className="flex items-center gap-2 mb-4 font-semibold text-primary hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Kembali ke Senarai
        </button>
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-background-light dark:bg-background-dark">
                {selectedStory.videoId ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedStory.videoId}`}
                        title={selectedStory.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
                )}
            </div>
            <div className="p-4 sm:p-6">
                <h2 className="text-3xl font-bold mb-4">{selectedStory.title}</h2>
                
                <div className="prose dark:prose-invert max-w-none whitespace-pre-line text-foreground-light dark:text-foreground-dark">
                {selectedStory.content}
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <BookMarkedIcon className="w-8 h-8" />
          Kisah Para Nabi & Rasul
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Ambil iktibar daripada perjalanan hidup utusan Allah.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} onSelect={() => setSelectedStory(story)} />
        ))}
      </div>
    </div>
  );
};

export default KisahNabiView;
