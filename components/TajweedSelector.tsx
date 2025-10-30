// FIX: The original content of this file was invalid. This new content provides the full, functional implementation for the TajweedSelector component.
import React, { useState } from 'react';
import type { PracticeMaterial, TajweedRule } from '../types';
import { IqraBookView } from './IqraBookView';
import { tajweedRulesData } from '../data/tajweedRulesData';
import { TajweedRuleInfo } from './TajweedRuleInfo';
import { BookOpenIcon, SparklesIcon } from './icons/Icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

interface TajweedSelectorProps {
    onSelectMaterial: (material: PracticeMaterial) => void;
}

type SelectorView = 'main' | 'iqra';

export const TajweedSelector: React.FC<TajweedSelectorProps> = ({ onSelectMaterial }) => {
    const [view, setView] = useState<SelectorView>('main');
    const [selectedRule, setSelectedRule] = useState<TajweedRule | null>(null);

    if (view === 'iqra') {
        return <IqraBookView onSelectMaterial={onSelectMaterial} onBack={() => setView('main')} />;
    }
    
    // Main view
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Tutor Tajwid AI</h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Pilih bahan latihan atau pelajari hukum tajwid asas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setView('iqra')}
                >
                    <CardHeader>
                        <BookOpenIcon className="w-10 h-10 text-primary mb-2" />
                        <CardTitle>Praktis Bacaan Iqra'</CardTitle>
                        <CardDescription>Pilih halaman dari buku Iqra' 1-6 untuk berlatih dengan maklum balas AI.</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="md:col-span-1">
                     <CardHeader>
                        <SparklesIcon className="w-10 h-10 text-accent mb-2" />
                        <CardTitle>Rujukan Hukum Tajwid</CardTitle>
                        <CardDescription>Fahami hukum-hukum tajwid asas dengan penerangan dan contoh.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                        {tajweedRulesData.map(rule => (
                            <button 
                                key={rule.id}
                                onClick={() => setSelectedRule(rule)}
                                className="w-full text-left p-3 rounded-md hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors"
                            >
                                {rule.name}
                            </button>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {selectedRule && <TajweedRuleInfo rule={selectedRule} onClose={() => setSelectedRule(null)} />}
        </div>
    );
};
