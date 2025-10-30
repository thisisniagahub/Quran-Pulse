import React, { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon, RefreshIcon } from './icons/Icons';

const duas = [
    {
        title: "Doa Sebelum Makan",
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا، وَقِنَا عَذَابَ النَّارِ",
        translation: "Ya Allah, berkatilah kami pada rezeki yang telah Engkau kurniakan dan jauhkanlah kami dari azab neraka.",
        count: 1
    },
    {
        title: "Doa Selepas Makan",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُסְלִמِينَ",
        translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami dari kalangan orang-orang Islam.",
        count: 1
    },
    {
        title: "Zikir Subhanallah",
        arabic: "سُبْحَانَ اللَّهِ",
        translation: "Maha Suci Allah.",
        count: 33
    },
    {
        title: "Zikir Alhamdulillah",
        arabic: "الْحَمْدُ لِلَّهِ",
        translation: "Segala puji bagi Allah.",
        count: 33
    },
    {
        title: "Zikir Allahu Akbar",
        arabic: "اللَّهُ أَكْبَرُ",
        translation: "Allah Maha Besar.",
        count: 33
    },
];

const DOA_COUNTS_STORAGE_KEY = 'quranPulseDoaCounts';

// The DoaCard is now a "controlled component" that receives its state and handlers from the parent.
const DoaCard: React.FC<{ 
    doa: typeof duas[0];
    currentCount: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onReset: () => void;
}> = ({ doa, currentCount, onIncrement, onDecrement, onReset }) => {
    
    const handleIncrement = () => {
        if (currentCount < doa.count) {
            onIncrement();
        }
    };
    
    const isCompleted = currentCount >= doa.count;

    return (
        <div className={`bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm transition-all duration-300 ${isCompleted ? 'border-2 border-accent' : ''}`}>
            <h3 className="font-bold text-lg text-primary-light dark:text-primary-dark">{doa.title}</h3>
            <p className="font-arabic text-2xl my-4 text-right">{doa.arabic}</p>
            <p className="text-sm text-foreground-light/80 italic">"{doa.translation}"</p>
            
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onReset} className="p-2 rounded-full hover:bg-white/10"><RefreshIcon /></button>
                    <button onClick={onDecrement} className="p-2 rounded-full hover:bg-white/10"><MinusIcon /></button>
                </div>
                <div 
                    onClick={handleIncrement}
                    className="flex-1 text-center mx-4 cursor-pointer"
                >
                    <span className="text-2xl font-bold">{currentCount}</span>
                    <span className="text-sm text-foreground-light/70"> / {doa.count}</span>
                </div>
                <button onClick={handleIncrement} className="p-2 rounded-full hover:bg-white/10"><PlusIcon /></button>
            </div>
             <div className="w-full bg-black/10 rounded-full h-2.5 mt-4">
              <div className="bg-primary-light dark:bg-primary-dark h-2.5 rounded-full" style={{ width: `${(currentCount / doa.count) * 100}%` }}></div>
            </div>
        </div>
    );
};

export const DoaList: React.FC = () => {
    // The parent component now manages the state for all cards.
    const [counts, setCounts] = useState<{[key: string]: number}>(() => {
        try {
            const savedCounts = localStorage.getItem(DOA_COUNTS_STORAGE_KEY);
            return savedCounts ? JSON.parse(savedCounts) : {};
        } catch (error) {
            console.error("Failed to load doa counts from localStorage", error);
            return {};
        }
    });

    // Save to localStorage whenever the counts state changes.
    useEffect(() => {
        try {
            localStorage.setItem(DOA_COUNTS_STORAGE_KEY, JSON.stringify(counts));
        } catch (error) {
            console.error("Failed to save doa counts to localStorage", error);
        }
    }, [counts]);

    const handleUpdateCount = (title: string, newCount: number) => {
        setCounts(prevCounts => ({
            ...prevCounts,
            [title]: newCount
        }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-2">Doa & Zikir Harian</h2>
                <p className="text-foreground-light/80">Koleksi doa masnun dan zikir harian untuk amalan anda.</p>
            </div>
            <div className="space-y-6">
                {duas.map((doa, index) => {
                    const currentCount = counts[doa.title] || 0;
                    return (
                        <DoaCard 
                            key={index} 
                            doa={doa} 
                            currentCount={currentCount}
                            onIncrement={() => handleUpdateCount(doa.title, currentCount + 1)}
                            onDecrement={() => handleUpdateCount(doa.title, Math.max(0, currentCount - 1))}
                            onReset={() => handleUpdateCount(doa.title, 0)}
                        />
                    )
                })}
            </div>
        </div>
    );
};