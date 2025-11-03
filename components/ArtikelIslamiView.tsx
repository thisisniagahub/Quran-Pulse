import React, { useState } from 'react';
import { artikelIslamiData } from '../data/artikelIslamiData';
import type { Article } from '../types';
import { NewspaperIcon, ChevronLeftIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';

export const ArtikelIslamiView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
      <div className="space-y-4">
        {artikelIslamiData.map(article => (
          <Card key={article.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedArticle(article)}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-sm text-foreground-light/70 mb-3">Oleh {article.author} • {article.date}</p>
              <p className="text-foreground-light/80 dark:text-foreground-dark/80">{article.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};