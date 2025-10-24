import React, { useState } from 'react';
import { PracticeMaterial } from '../types';
import { BookOpenIcon } from './icons/Icons';
import { IqraBookView } from './IqraBookView';

const surahNames = [
    "Al-Fatihah", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saf", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

interface TajweedSelectorProps {
    onSelectMaterial: (material: PracticeMaterial) => void;
}

export const TajweedSelector: React.FC<TajweedSelectorProps> = ({ onSelectMaterial }) => {
    const [selection, setSelection] = useState<'iqra' | 'quran' | null>(null);
    const [loadingQuran, setLoadingQuran] = useState(false);

    const handleQuranSurahSelect = async (surahNumber: number) => {
        if (!surahNumber) return;
        setLoadingQuran(true);
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            if (!response.ok) throw new Error("Failed to fetch Surah data.");
            const data = await response.json();
            if (data.code !== 200) throw new Error(data.status);
            
            const ayahs = data.data.ayahs.slice(0, 5); // Get first 5 ayahs
            const content = ayahs.map((ayah: any) => `${ayah.text}  ﴿${ayah.numberInSurah}﴾`).join('\n');
            
            onSelectMaterial({
                title: `Surah ${data.data.englishName}`,
                content: content,
                type: 'quran'
            });

        } catch (error) {
            console.error("Error fetching Surah:", error);
            // Handle error, maybe show a toast
        } finally {
            setLoadingQuran(false);
        }
    };
    
    const renderQuranSelection = () => (
         <div>
            <button onClick={() => setSelection(null)} className="text-sm mb-4 hover:underline">&larr; Kembali</button>
            <h3 className="text-xl font-bold mb-4 text-center">Pilih Surah Al-Quran</h3>
             <select 
                onChange={(e) => handleQuranSurahSelect(Number(e.target.value))}
                disabled={loadingQuran}
                defaultValue=""
                className="w-full p-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary"
            >
                <option value="" disabled>{loadingQuran ? "Memuatkan..." : "Pilih Surah"}</option>
                {surahNames.map((name, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}. {name}</option>
                ))}
            </select>
            {loadingQuran && <div className="text-center mt-4">Memuatkan ayat...</div>}
        </div>
    );


    const renderMainSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setSelection('iqra')} className="flex flex-col items-center justify-center p-8 bg-card-light dark:bg-card-dark rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <BookOpenIcon className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Mengaji Iqra'</h3>
                <p className="text-sm text-foreground-light/70 dark:text-foreground-dark/70">Untuk peringkat permulaan</p>
            </button>
            <button onClick={() => setSelection('quran')} className="flex flex-col items-center justify-center p-8 bg-card-light dark:bg-card-dark rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <BookOpenIcon className="w-16 h-16 text-accent mb-4" />
                <h3 className="text-2xl font-bold">Mengaji Al-Quran</h3>
                <p className="text-sm text-foreground-light/70 dark:text-foreground-dark/70">Untuk melancarkan bacaan</p>
            </button>
        </div>
    );

    const renderContent = () => {
        switch (selection) {
            case 'iqra':
                return <IqraBookView onSelectMaterial={onSelectMaterial} onBack={() => setSelection(null)} />;
            case 'quran':
                return renderQuranSelection();
            default:
                return renderMainSelection();
        }
    }


    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Tutor Tajwid AI (PRO)</h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Pilih bahan latihan anda untuk memulakan sesi.</p>
            </div>
            
            {renderContent()}

        </div>
    );
};