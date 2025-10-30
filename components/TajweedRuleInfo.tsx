import React from 'react';
import { TajweedRule } from '../data/tajweedRulesData';
import { XIcon } from './icons/Icons';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

interface TajweedRuleInfoProps {
  rule: TajweedRule;
  onClose: () => void;
}

export const TajweedRuleInfo: React.FC<TajweedRuleInfoProps> = ({ rule, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card-light dark:bg-card-dark z-10 border-b border-border-light dark:border-border-dark">
          <div>
            <p className="font-arabic text-2xl text-primary">{rule.arabic}</p>
            <CardTitle>{rule.name}</CardTitle>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5">
            <XIcon />
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Definisi</h4>
              <p className="text-foreground-light/90 dark:text-foreground-dark/90">{rule.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Cara Bacaan</h4>
              <p className="text-foreground-light/90 dark:text-foreground-dark/90">{rule.howToRead}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Contoh-contoh</h4>
              <div className="space-y-3">
                {rule.examples.map((example, index) => (
                  <div key={index} className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                    <p dir="rtl" className="font-arabic text-3xl mb-2 text-right">{example.arabic}</p>
                    <p className="font-transliteration text-lg text-accent mb-1">{example.transliteration}</p>
                    <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80">{example.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
