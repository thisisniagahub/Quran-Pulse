import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { addIqraPracticeSession } from '../services/dbService';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { MicrophoneIcon, XIcon, StarIcon, RefreshIcon } from './icons/Icons';

interface PracticeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  practiceText: string;
  book: number;
  page: number;
}

export const PracticeModeModal: React.FC<PracticeModeModalProps> = ({ isOpen, onClose, practiceText, book, page }) => {
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setTranscript(text);
      if (isFinal) {
        calculateScore(text);
      }
    },
    onError: (err) => setError(err)
  });
  
  const calculateScore = (userTranscript: string) => {
    // Simple scoring algorithm: percentage of matching words
    const originalWords = practiceText.split(/\s+/).filter(Boolean);
    const userWords = userTranscript.split(/\s+/).filter(Boolean);
    let correctWords = 0;
    
    // This is a basic comparison. A more advanced version could use Levenshtein distance.
    originalWords.forEach(word => {
        if (userWords.includes(word)) {
            correctWords++;
        }
    });

    const accuracy = originalWords.length > 0 ? (correctWords / originalWords.length) * 100 : 0;
    const finalScore = Math.min(Math.round(accuracy), 100);
    setScore(finalScore);

    const stars = finalScore > 90 ? 3 : finalScore > 75 ? 2 : finalScore > 50 ? 1 : 0;
    addIqraPracticeSession({ book, page, score: finalScore, stars });
  };
  
  const reset = () => {
    setTranscript('');
    setScore(null);
    setError(null);
  }

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stars = score === null ? 0 : score > 90 ? 3 : score > 75 ? 2 : score > 50 ? 1 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mod Latihan: Iqra' {book}, Halaman {page}</h2>
            <Button onClick={onClose} variant="ghost" size="icon"><XIcon /></Button>
          </div>
          
          <div dir="rtl" className="font-arabic text-3xl text-center leading-loose p-4 bg-background-light dark:bg-background-dark rounded-lg mb-6">
            <p>{practiceText}</p>
          </div>
          
          <div className="text-center">
            <Button onClick={isListening ? stopListening : startListening} disabled={!isSupported || score !== null} size="lg" className="gap-2">
                <MicrophoneIcon />
                {isListening ? "Berhenti" : "Mula Baca"}
            </Button>
            {error && <p className="text-primary text-sm mt-2">{error}</p>}
          </div>

          {transcript && (
            <div className="mt-6">
                <h3 className="font-semibold mb-2">Transkrip Anda:</h3>
                <p dir="rtl" className="font-arabic text-xl p-3 bg-background-light dark:bg-background-dark rounded-md">{transcript}</p>
            </div>
          )}
          
          {score !== null && (
            <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold">Sesi Selesai!</h3>
                <p className="text-5xl font-bold my-4 text-primary">{score}%</p>
                <div className="flex justify-center gap-2 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <StarIcon key={i} className={`w-10 h-10 transition-colors ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                </div>
                 <Button onClick={reset} className="gap-2"><RefreshIcon /> Cuba Lagi</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
