import React, { useState } from 'react';
import { SpeakerWaveIcon, MicrophoneIcon, CheckIcon, XIcon, HeartIcon, StarIcon, ArrowRightIcon, TrophyIcon, SparklesIcon } from './icons/Icons';
import { useToast } from '../context/ToastContext';

interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'speaking' | 'audio' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  xp: number;
}

const InteractiveLesson: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hearts, setHearts] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const { addToast } = useToast();

  const questions: Question[] = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Apakah hukum tajwid ketika nun mati (نْ) bertemu dengan huruf Ba (ب)?',
      options: ['Izhar', 'Idgham', 'Iqlab', 'Ikhfa'],
      correctAnswer: 2,
      explanation: 'Iqlab berlaku apabila nun mati atau tanwin bertemu dengan huruf Ba (ب). Nun mati dibaca seperti Mim dengan dengung.',
      xp: 50
    },
    {
      id: 2,
      type: 'audio',
      question: 'Dengar audio dan pilih ayat yang betul',
      options: [
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        'قُلْ هُوَ اللَّهُ أَحَدٌ',
        'قُلْ أَعُوذُ بِرَبِّ النَّاسِ'
      ],
      correctAnswer: 0,
      explanation: 'Audio yang dimainkan adalah Basmalah - pembukaan setiap surah kecuali At-Taubah.',
      xp: 30
    },
  ];

  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setXpEarned(xpEarned + question.xp);
      setStreak(streak + 1);
    } else {
      setHearts(Math.max(0, hearts - 1));
      setStreak(0);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAccuracyScore(null);
    
    if (hearts === 0) {
        addToast({ type: 'error', title: 'Nyawa Habis!', description: 'Sesi dimulakan semula.' });
        setCurrentQuestion(0); setHearts(5); setXpEarned(0); setStreak(0);
        return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      addToast({ type: 'success', title: 'Tahniah!', description: `Pelajaran Selesai! Anda peroleh ${xpEarned} XP!` });
      setCurrentQuestion(0); setHearts(5); setXpEarned(0); setStreak(0);
    }
  };

  const playAudio = () => addToast({ type: 'info', title: 'Audio Dimainkan', description: '(Fungsi demo)' });
  const startRecording = () => {
    addToast({ type: 'info', title: 'Mikrofon Aktif', description: 'Sila mula membaca... (Fungsi demo)' });
    setTimeout(() => {
      const randomAccuracy = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
      setAccuracyScore(randomAccuracy);
      handleAnswer(0);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-xl p-4 mb-6 border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <HeartIcon key={i} className={`w-6 h-6 transition-colors ${i < hearts ? 'fill-red-500 text-red-500' : 'text-foreground/20'}`} />
              ))}
            </div>
          </div>
          <div className="relative h-4 bg-background rounded-md overflow-hidden border-2 border-border">
            <div className="absolute h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 min-h-[400px] flex flex-col justify-between border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
          {!showFeedback ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
              {question.type === 'audio' && (
                <div className="mb-6"><button onClick={playAudio} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))] active:shadow-none active:translate-y-px flex items-center justify-center gap-2"><SpeakerWaveIcon className="w-6 h-6" /> Main Audio</button></div>
              )}
              {(question.type === 'multiple-choice' || question.type === 'fill-blank' || question.type === 'audio') && (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <button key={index} onClick={() => handleAnswer(index)}
                      className={`w-full p-4 rounded-xl border-2 border-border font-semibold text-left transition-all bg-background shadow-[2px_2px_0px_hsl(var(--border))] active:shadow-none active:translate-y-px ${question.type === 'audio' ? 'font-arabic text-2xl' : ''} ${selectedAnswer === index ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/10'}`}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center`}>
              {isCorrect ? (
                <div>
                  <h2 className="text-3xl font-bold text-green-500 mb-2">Betul! 🎉</h2>
                  <p className="text-green-600 dark:text-green-400 text-lg">Anda peroleh +{question.xp} XP</p>
                </div>
              ) : (
                <div><h2 className="text-3xl font-bold text-red-500 mb-2">Salah</h2><p className="text-red-600 dark:text-red-400">-1 ❤️</p></div>
              )}
              <div className="bg-background rounded-xl p-4 my-6 text-left border-2 border-border">
                <h3 className="font-bold mb-2">💡 Penjelasan</h3>
                <p className="text-foreground/80">{question.explanation}</p>
              </div>
            </div>
          )}

           <button onClick={handleNext} disabled={!showFeedback}
                className={`w-full py-3 mt-8 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))] active:shadow-none active:translate-y-px disabled:bg-gray-400/20 disabled:text-gray-500/50 disabled:cursor-not-allowed ${isCorrect ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-primary hover:bg-primary/90'}`}>
                {currentQuestion < questions.length - 1 ? 'Teruskan' : 'Selesai'}
                {currentQuestion < questions.length - 1 ? <ArrowRightIcon className="w-5 h-5" /> : <TrophyIcon className="w-5 h-5" />}
            </button>
        </div>
    </div>
  );
};

export default InteractiveLesson;
