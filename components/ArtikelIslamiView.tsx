import React, { useState, useEffect } from 'react';
import type { Article } from '../types';
import { getCache, setCache } from '../services/dbService';
import { NewspaperIcon, ChevronLeftIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';
import { Skeleton } from './ui/Skeleton';

const ListItemSkeleton = () => (
     <Card>
        <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 mb-3" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full" />
        </CardContent>
    </Card>
);

const ArtikelSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => <ListItemSkeleton key={i} />)}
    </div>
);


export const ArtikelIslamiView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const cachedData = await getCache('artikelIslamiData');
        if (cachedData) {
          setArticles(cachedData);
        } else {
          const response = await fetch('/data/artikelIslamiData.json');
          const data = await response.json();
          setArticles(data);
          await setCache('artikelIslamiData', data);
        }
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 mb-4 font-semibold text-primary hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Kembali ke Senarai Artikel
        </button>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-2">{selectedArticle.title}</h2>
            <p className="text-sm text-foreground-light/70 mb-4">Oleh {selectedArticle.author} • {selectedArticle.date}</p>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
              {selectedArticle.content}
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
          <NewspaperIcon className="w-8 h-8" />
          Artikel Islami
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Koleksi penulisan untuk santapan rohani dan minda.</p>
      </div>
      {isLoading ? (
        <ArtikelSkeleton />
      ) : (
        <div className="space-y-4">
          {articles.map(article => (
            <Card key={article.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedArticle(article)}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-foreground-light/70 mb-3">Oleh {article.author} • {article.date}</p>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">{article.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtikelIslamiView;