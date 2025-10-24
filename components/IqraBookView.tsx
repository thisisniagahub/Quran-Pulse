import React, { useState, useEffect, useCallback } from 'react';
import { iqraData } from '../data/iqraData';
import type { PracticeMaterial } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, MicrophoneIcon } from './icons/Icons';
import { useAudioPlayer } from '../context/AudioContext';
import { generateSpeech } from '../services/geminiService';

interface IqraBookViewProps {
  onSelectMaterial: (material: PracticeMaterial) => void;
  onBack: () => void;
}

const uniqueBooks = [...new Set(iqraData.map(p => p.book))];

const InteractiveWord: React.FC<{
    word: string;
    onClick: () => void;
    isLoading: boolean;
    isPlaying: boolean;
}> = ({ word, onClick, isLoading, isPlaying }) => {
    const baseClasses = 'px-3 py-1 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-card-dark focus:ring-primary';
    let stateClasses = '';

    if (isLoading) {
        stateClasses = 'bg-gray-200 dark:bg-gray-700 animate-pulse cursor-wait';
    } else if (isPlaying) {
        // Use the primary theme color for a very distinct highlight.
        stateClasses = 'bg-primary text-white font-bold shadow-lg scale-105';
    } else {
        stateClasses = 'hover:bg-gray-200 dark:hover:bg-gray-700';
    }

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`${baseClasses} ${stateClasses}`}
        >
            <span className={isLoading ? 'opacity-0' : ''}>{word}</span>
        </button>
    );
};


export const IqraBookView: React.FC<IqraBookViewProps> = ({ onSelectMaterial, onBack }) => {
  const [selectedBook, setSelectedBook] = useState<number>(1);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>('1');
  
  const { playTrack, track, isPlaying, currentTime, duration, stop } = useAudioPlayer();

  const [loadingWord, setLoadingWord] = useState<string | null>(null);
  const [playbackQueue, setPlaybackQueue] = useState<string[]>([]);

  const pagesForBook = iqraData.filter(p => p.book === selectedBook);
  const currentPageData = pagesForBook[currentPageIndex];

  useEffect(() => {
    if (currentPageData) {
      setPageInput(currentPageData.page.toString());
    }
  }, [currentPageData]);

  const getWordId = useCallback((word: string, lineIndex: number, wordIndex: number) => {
      return `b${selectedBook}-p${currentPageData.page}-l${lineIndex}-w${wordIndex}-${word}`;
  }, [selectedBook, currentPageData]);

  const handleWordClick = async (word: string, wordId: string) => {
    if (loadingWord || (isPlaying && track?.title === wordId)) return;
    
    stop();
    setPlaybackQueue([]);

    setLoadingWord(wordId);
    try {
        const audioData = await generateSpeech(word);
        if (audioData) {
            playTrack({ src: audioData, title: wordId, type: 'wav_base64' });
        }
    } catch (e) {
        console.error("Failed to generate speech for word:", e);
    } finally {
        setLoadingWord(null);
    }
  };
  
  const handlePlayPage = () => {
    if (!currentPageData) return;
    stop();
    setPlaybackQueue([]);

    const wordsToPlay: { id: string }[] = [];
    currentPageData.lines.forEach((line, lineIndex) => {
      if (line.includes('=')) {
        const parts = line.split('=');
        const components = parts[0].trim().split('+');
        const result = parts[1].trim();

        components.forEach((word, wordIndex) => {
          wordsToPlay.push({ id: getWordId(word.trim(), lineIndex, wordIndex) });
        });
        wordsToPlay.push({ id: getWordId(result, lineIndex, 99) }); // 99 for result
      } else {
        line.split(' ').filter(word => word.trim() !== '').forEach((word, wordIndex) => {
          wordsToPlay.push({ id: getWordId(word, lineIndex, wordIndex) });
        });
      }
    });
    
    setPlaybackQueue(wordsToPlay.map(item => item.id));
  };

  useEffect(() => {
    const trackFinished = !isPlaying && duration > 0 && Math.abs(currentTime - duration) < 0.2;
    if (trackFinished && playbackQueue.length > 0 && track?.title === playbackQueue[0]) {
        setPlaybackQueue(q => q.slice(1));
    }
  }, [isPlaying, currentTime, duration, playbackQueue, track]);

  useEffect(() => {
    const playNextInQueue = async () => {
        if (playbackQueue.length > 0 && !isPlaying && !loadingWord) {
            const wordIdToPlay = playbackQueue[0];
            const word = wordIdToPlay.substring(wordIdToPlay.lastIndexOf('-') + 1);
            
            setLoadingWord(wordIdToPlay);
            try {
                const audioData = await generateSpeech(word);
                if (audioData) {
                    playTrack({ src: audioData, title: wordIdToPlay, type: 'wav_base64' });
                } else {
                    setPlaybackQueue(q => q.slice(1));
                }
            } catch (e) {
                console.error("Failed to generate speech for queue item:", e);
                setPlaybackQueue(q => q.slice(1));
            } finally {
                setLoadingWord(null);
            }
        }
    };
    playNextInQueue();
  }, [playbackQueue, isPlaying, loadingWord, playTrack]);

  const handleSelectPageForPractice = () => {
    if (currentPageData) {
      onSelectMaterial({
        title: `Iqra' ${currentPageData.book}, Halaman ${currentPageData.page}`,
        content: currentPageData.lines.join('\n'),
        type: 'iqra',
      });
    }
  };

  const changeBook = (book: number) => {
    stop();
    setPlaybackQueue([]);
    setSelectedBook(book);
    setCurrentPageIndex(0);
  };
  
  const goToPageIndex = (index: number) => {
      if (index >= 0 && index < pagesForBook.length) {
          stop();
          setPlaybackQueue([]);
          setCurrentPageIndex(index);
      }
  }

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(pageInput, 10);
      const newIndex = pagesForBook.findIndex(p => p.page === pageNum);
      if (newIndex !== -1) {
        goToPageIndex(newIndex);
      } else {
        setPageInput(currentPageData.page.toString());
      }
      e.currentTarget.blur();
    }
  };

  const handleInputBlur = () => {
    if (currentPageData) {
      setPageInput(currentPageData.page.toString());
    }
  };
  
  useEffect(() => {
      return () => { stop(); }
  }, [stop]);

  return (
    <div className="w-full max-w-3xl mx-auto">
        <button onClick={onBack} className="text-sm mb-4 hover:underline">&larr; Kembali ke Pemilihan Latihan</button>
        <div className="flex justify-center gap-1 mb-4 p-1 bg-background-light dark:bg-background-dark rounded-lg">
            {uniqueBooks.map(bookNum => (
                <button
                    key={bookNum}
                    onClick={() => changeBook(bookNum)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${selectedBook === bookNum ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                >
                    Iqra' {bookNum}
                </button>
            ))}
        </div>

        {currentPageData && (
            <div className="bg-white dark:bg-card-dark shadow-lg rounded-lg p-6 sm:p-8 mt-4 border-t-8 border-primary">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-border-dark">
                    <div className="font-bold text-lg text-primary">Iqra' {selectedBook}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Halaman {currentPageData.page}</div>
                </div>

                <div dir="rtl" className="py-8 font-arabic text-4xl sm:text-5xl leading-loose sm:leading-loose space-y-8 text-gray-800 dark:text-foreground-dark">
                    {currentPageData.lines.map((line, lineIndex) => {
                        if (line.includes('=')) {
                            const parts = line.split('=');
                            const components = parts[0].trim().split('+');
                            const result = parts[1].trim();
                            const resultWordId = getWordId(result, lineIndex, 99); // Use a unique index for the result

                            return (
                                <div key={lineIndex} className="flex justify-center items-center gap-x-2 sm:gap-x-4 flex-wrap" dir="rtl">
                                    <InteractiveWord
                                        key={resultWordId}
                                        word={result}
                                        onClick={() => handleWordClick(result, resultWordId)}
                                        isLoading={loadingWord === resultWordId}
                                        isPlaying={isPlaying && track?.title === resultWordId}
                                    />
                                    <span className="text-3xl text-primary mx-2 font-sans self-center">=</span>
                                    <div className="flex items-center gap-x-1 sm:gap-x-2">
                                        {components.map((word, wordIndex) => {
                                            const wordId = getWordId(word.trim(), lineIndex, wordIndex);
                                            return (
                                                <React.Fragment key={wordId}>
                                                  <InteractiveWord
                                                      word={word.trim()}
                                                      onClick={() => handleWordClick(word.trim(), wordId)}
                                                      isLoading={loadingWord === wordId}
                                                      isPlaying={isPlaying && track?.title === wordId}
                                                  />
                                                  {wordIndex < components.length - 1 && <span className="text-3xl text-primary font-sans self-center">+</span>}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }
                        
                        // Fallback for regular lines
                        return (
                            <div key={lineIndex} className="flex justify-center items-center gap-x-4 sm:gap-x-6 flex-wrap">
                                {line.split(' ').filter(word => word.trim() !== '').map((word, wordIndex) => {
                                    const wordId = getWordId(word, lineIndex, wordIndex);
                                    return (
                                        <InteractiveWord
                                            key={wordId}
                                            word={word}
                                            onClick={() => handleWordClick(word, wordId)}
                                            isLoading={loadingWord === wordId}
                                            isPlaying={isPlaying && track?.title === wordId}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-border-dark">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => goToPageIndex(currentPageIndex - 1)} disabled={currentPageIndex === 0} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50" aria-label="Halaman Sebelumnya">
                            <ChevronLeftIcon />
                        </button>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <label htmlFor="page-input" className="sr-only">Nombor Halaman</label>
                            <span>Halaman</span>
                            <input
                                id="page-input"
                                type="text"
                                inputMode="numeric"
                                value={pageInput}
                                onChange={handlePageInputChange}
                                onKeyDown={handlePageJump}
                                onBlur={handleInputBlur}
                                className="w-14 text-center py-1 px-2 rounded-md bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:outline-none"
                                aria-label={`Halaman semasa ${currentPageData.page}`}
                            />
                            <span>/ {pagesForBook.length}</span>
                        </div>
                        <button onClick={() => goToPageIndex(currentPageIndex + 1)} disabled={currentPageIndex === pagesForBook.length - 1} className="p-2 rounded-full hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50" aria-label="Halaman Seterusnya">
                            <ChevronRightIcon />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handlePlayPage} disabled={playbackQueue.length > 0 || !!loadingWord} className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50">
                            <SpeakerWaveIcon className="w-5 h-5"/>
                            Dengar Halaman
                        </button>
                         <button
                            onClick={handleSelectPageForPractice}
                            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-accent text-background-dark rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                            Praktis Dengan Tutor AI
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};