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
    {
      id: 3,
      type: 'fill-blank',
      question: 'Lengkapkan ayat berikut: الْحَمْدُ لِلَّهِ رَبِّ ____',
      options: ['الْعَالَمِينَ', 'الرَّحِيمِ', 'الْكَرِيمِ', 'الْعَظِيمِ'],
      correctAnswer: 0,
      explanation: 'Ayat lengkap: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (Segala puji bagi Allah, Tuhan semesta alam)',
      xp: 40
    },
    {
      id: 4,
      type: 'speaking',
      question: 'Baca ayat berikut dengan tajwid yang betul',
      options: ['بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'],
      correctAnswer: 0,
      explanation: 'Fokus pada: Mad Asli (مَٰ), hukum Lam pada lafaz Allah, dan Ra\' (ر) yang dibaca tebal (tafkhim).',
      xp: 100
    },
    {
      id: 5,
      type: 'matching',
      question: 'Padankan surah dengan maknanya',
      options: ['Al-Fatihah = Pembukaan', 'Al-Ikhlas = Keikhlasan', 'An-Nas = Manusia', 'Al-Falaq = Subuh'],
      correctAnswer: 0,
      explanation: 'Setiap surah mempunyai makna yang mendalam berkaitan dengan kandungannya.',
      xp: 60
    }
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
    setAccuracyScore(null); // Reset accuracy score
    
    if (hearts === 0) {
        addToast({
            type: 'error',
            title: 'Nyawa Habis!',
            description: 'Anda telah kehabisan nyawa. Sesi dimulakan semula.'
        });
        setCurrentQuestion(0);
        setHearts(5);
        setXpEarned(0);
        setStreak(0);
        return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      addToast({
          type: 'success',
          title: 'Tahniah! Pelajaran Selesai!',
          description: `Anda telah memperoleh ${xpEarned} XP!`
      });
      setCurrentQuestion(0);
      setHearts(5);
      setXpEarned(0);
      setStreak(0);
    }
  };

  const playAudio = () => {
    addToast({ type: 'info', title: 'Audio Dimainkan', description: '(Fungsi demo)' });
  };

  const startRecording = () => {
    addToast({ type: 'info', title: 'Mikrofon Aktif', description: 'Sila mula membaca... (Fungsi demo)' });
    setTimeout(() => {
      // Simulate a high accuracy score for the demo
      const randomAccuracy = Math.floor(Math.random() * (100 - 85 + 1)) + 85; // Random score between 85 and 100
      setAccuracyScore(randomAccuracy);
      handleAnswer(0); // Auto-correct for demo
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <HeartIcon
                  key={i}
                  className={`w-6 h-6 transition-colors ${
                    i < hearts 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              {streak > 1 && (
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 px-3 py-1 rounded-full">
                  <SparklesIcon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{streak}x Streak!</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{xpEarned} XP</span>
              </div>
            </div>
          </div>

          <div className="relative h-3 bg-background rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card rounded-xl shadow-sm p-8 min-h-[400px] flex flex-col justify-between">
          {!showFeedback ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {question.question}
              </h2>

              {question.type === 'audio' && (
                <div className="mb-6">
                  <button onClick={playAudio} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <SpeakerWaveIcon className="w-6 h-6" /> Main Audio
                  </button>
                </div>
              )}

              {question.type === 'speaking' && (
                <div className="mb-6">
                  <div className="bg-background rounded-xl p-6 text-center mb-4">
                    <p className="text-4xl font-arabic mb-2">{question.options?.[0]}</p>
                  </div>
                  <button onClick={startRecording} className="w-full py-4 bg-accent text-background-dark rounded-xl font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                    <MicrophoneIcon className="w-6 h-6" /> Mula Rakam
                  </button>
                </div>
              )}

              {(question.type === 'multiple-choice' || question.type === 'fill-blank' || question.type === 'audio') && (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-4 rounded-xl border-2 font-semibold text-left transition-all ${question.type === 'audio' ? 'font-arabic text-2xl' : ''} ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-border hover:border-primary/50 bg-background'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

               {question.type === 'matching' && (
                <div className="space-y-3">
                    <p className="text-sm text-center text-foreground/70">Pilih padanan yang betul (fungsi demo).</p>
                    {question.options?.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full p-4 border-2 border-border rounded-xl hover:border-primary/50 bg-background cursor-pointer transition-all text-center"
                    >
                        {option}
                    </button>
                    ))}
                </div>
                )}
            </div>
          ) : (
            /* Feedback Card */
            <div className={`text-center`}>
              {isCorrect ? (
                <div>
                  <h2 className="text-3xl font-bold text-green-500 mb-2">Betul! 🎉</h2>
                  {question.type === 'speaking' && accuracyScore !== null ? (
                    <p className="text-green-600 dark:text-green-400 text-lg">
                      Ketepatan: <span className="font-bold">{accuracyScore}%</span>
                    </p>
                  ) : (
                    <p className="text-green-600 dark:text-green-400 text-lg">
                      Anda peroleh +{question.xp} XP
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-red-500 mb-2">Salah</h2>
                  <p className="text-red-600 dark:text-red-400">-1 ❤️</p>
                </div>
              )}
              <div className="bg-background rounded-xl p-4 my-6 text-left">
                <h3 className="font-bold mb-2">💡 Penjelasan</h3>
                <p className="text-foreground/80">{question.explanation}</p>
              </div>
            </div>
          )}

           <button
                onClick={handleNext}
                disabled={!showFeedback}
                className={`w-full py-3 mt-8 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400/20 disabled:text-gray-500/50 disabled:cursor-not-allowed ${
                    isCorrect 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
                >
                {currentQuestion < questions.length - 1 ? 'Teruskan' : 'Selesai'}
                {currentQuestion < questions.length - 1 ? <ArrowRightIcon className="w-5 h-5" /> : <TrophyIcon className="w-5 h-5" />}
            </button>
        </div>
    </div>
  );
};

export default InteractiveLesson;