import React from 'react';
import { dailyQuoteData, DailyQuote } from '../data/dailyQuoteData';
import { LightbulbIcon, Share2Icon } from './icons/Icons';

const DailyQuoteView: React.FC = () => {
  const handleShare = async (item: DailyQuote) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Petikan Harian dari QuranPulse',
          text: `"${item.quote}"\n\n- ${item.source}\n\n---\nDikongsi dari QuranPulse - Teman Harian Anda untuk Pertumbuhan Rohani.`,
        });
      } catch (error) {
        console.error('Error sharing quote:', error);
      }
    } else {
      alert('Fungsi kongsi tidak disokong pada pelayar ini.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
          <LightbulbIcon className="w-8 h-8" />
          Petikan Harian
        </h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">
          Inspirasi harian daripada Al-Quran dan Hadith untuk jiwa anda.
        </p>
      </div>

      <div className="space-y-6">
        {dailyQuoteData.map((item) => (
          <div key={item.id} className="relative rounded-xl overflow-hidden shadow-lg min-h-[250px] flex items-end text-white">
            <img 
              src={item.imageUrl} 
              alt={`Background for quote from ${item.source}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="relative z-10 p-6 w-full">
              <blockquote className="text-xl lg:text-2xl font-semibold leading-tight">
                "{item.quote}"
              </blockquote>
              <div className="flex justify-between items-center mt-4">
                <cite className="block text-sm opacity-90 not-italic pr-4">
                  - {item.source}
                </cite>
                <button 
                  onClick={() => handleShare(item)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors flex-shrink-0"
                  aria-label="Kongsi petikan"
                >
                  <Share2Icon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyQuoteView;