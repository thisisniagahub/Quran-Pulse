import React, { useState, useEffect } from 'react';
import type { IqraPage, PracticeMaterial } from '../types';
import { getCache, setCache } from '../services/dbService';
import { Button } from './ui/Button';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, MicrophoneIcon } from './icons/Icons';
import { PracticeModeModal } from './PracticeModeModal';

interface IqraBookViewProps {
    onSelectMaterial: (material: PracticeMaterial) => void;
    onBack: () => void;
}

export const IqraBookView: React.FC<IqraBookViewProps> = ({ onSelectMaterial }) => {
    const [iqraContent, setIqraContent] = useState<IqraPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [book, setBook] = useState(1);
    const [page, setPage] = useState(1);
    const [isPracticeModalOpen, setPracticeModalOpen] = useState(false);

    useEffect(() => {
        const loadIqraContent = async () => {
            setIsLoading(true);
            try {
                const cachedData = await getCache('iqraContent');
                if (cachedData && cachedData.length > 0) {
                    setIqraContent(cachedData);
                } else {
                    const response = await fetch('/data/iqraData.json');
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    setIqraContent(data);
                    await setCache('iqraContent', data);
                }
            } catch (error) {
                console.error("Failed to load Iqra' content", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadIqraContent();
    }, []);

    const pagesForBook = iqraContent.filter(p => p.book === book);
    const currentPageData = pagesForBook.find(p => p.page === page);

    const handleSelectForAICoach = (line: string) => {
        if (!line.trim()) return;
        onSelectMaterial({
            title: `Latihan Iqra' ${book}, Halaman ${page}`,
            content: line,
            type: 'iqra'
        });
    };
    
    const handleNextPage = () => {
        if (page < pagesForBook.length) {
            setPage(p => p + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(p => p - 1);
        }
    };

    const handleBookChange = (newBook: number) => {
        setBook(newBook);
        setPage(1);
    }

    const fullPageText = currentPageData?.lines.join(' ') || '';

    if (isLoading) {
        return <div className="text-center p-8">Memuatkan kandungan Iqra'...</div>;
    }

    return (
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm">
            <div className="flex justify-center gap-2 mb-4 p-1 bg-background-light dark:bg-background-dark rounded-lg">
                {[1, 2, 3, 4, 5, 6].map(b => (
                    <Button key={b} onClick={() => handleBookChange(b)} variant={book === b ? 'secondary' : 'ghost'} size="sm">
                        Iqra' {b}
                    </Button>
                ))}
            </div>

            {currentPageData ? (
                <div>
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-xl text-primary">{currentPageData.title}</h3>
                        {currentPageData.description && <p className="text-sm text-foreground-light/80">{currentPageData.description}</p>}
                    </div>

                    <div dir="rtl" className="font-arabic text-3xl text-center leading-loose p-6 bg-background-light dark:bg-background-dark rounded-lg space-y-4">
                        <p className="text-sm text-left text-foreground-light/60 dark:text-foreground-dark/60" dir="ltr">Klik pada baris untuk maklum balas Tajwid AI.</p>
                        {currentPageData.lines.map((line, index) => (
                            <p key={index} onClick={() => handleSelectForAICoach(line)} className="cursor-pointer hover:bg-primary/10 p-2 rounded-md transition-colors">
                                {line || <span className="opacity-0">.</span>}
                            </p>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <Button onClick={handlePrevPage} disabled={page === 1} variant="ghost"><ChevronLeftIcon /> Muka Surat Sebelumnya</Button>
                        <span className="font-semibold">{page} / {pagesForBook.length}</span>
                        <Button onClick={handleNextPage} disabled={page === pagesForBook.length} variant="ghost">Muka Surat Seterusnya <ChevronRightIcon /></Button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row gap-4">
                         <Button onClick={() => setPracticeModalOpen(true)} className="flex-1 gap-2" variant="accent">
                            <MicrophoneIcon />
                            Mula Latihan Sebutan (Satu Halaman)
                        </Button>
                    </div>
                </div>
            ) : (
                <p>Halaman tidak ditemui.</p>
            )}

            <PracticeModeModal 
                isOpen={isPracticeModalOpen}
                onClose={() => setPracticeModalOpen(false)}
                practiceText={fullPageText}
                book={book}
                page={page}
            />
        </div>
    );
};
