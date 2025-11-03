import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { XIcon, LightbulbIcon, SparklesIcon, ChatBubbleIcon, MicrophoneIcon, ArrowRightIcon, ChevronLeftIcon } from './icons/Icons';

interface OnboardingTutorialProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    icon: <LightbulbIcon className="w-16 h-16 text-primary" />,
    title: 'Selamat Datang ke Ciri AI QuranPulse!',
    description: 'Jom kenali beberapa alatan pintar yang boleh membantu perjalanan pembelajaran anda.',
  },
  {
    icon: <SparklesIcon className="w-16 h-16 text-primary" />,
    title: 'Sobat AI Cerdas',
    description: 'Tanya apa sahaja, daripada maksud ayat hinggalah kepada cadangan kandungan. Sobat AI sedia membantu!',
  },
  {
    icon: <ChatBubbleIcon className="w-16 h-16 text-primary" />,
    title: 'Tanya Ustaz',
    description: 'Dapatkan jawapan yang lebih formal dan berstruktur untuk soalan-soalan berkaitan feqah dan ibadah.',
  },
  {
    icon: <MicrophoneIcon className="w-16 h-16 text-primary" />,
    title: 'Tutor Tajwid',
    description: 'Rakam bacaan Al-Quran atau Iqra\' anda dan dapatkan maklum balas segera tentang sebutan dan hukum tajwid.',
  },
];

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Finish on the last step
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <Card className="w-full max-w-md text-center animate-fade-in-up">
        <CardContent className="p-8">
          <div className="flex justify-end">
             <Button onClick={onClose} variant="ghost" size="sm">Langkau</Button>
          </div>
          
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-6">
            {stepData.icon}
          </div>
          
          <h2 className="text-2xl font-bold mb-3">{stepData.title}</h2>
          <p className="text-foreground-light/80 dark:text-foreground-dark/80 mb-8 min-h-[72px]">
            {stepData.description}
          </p>

          <div className="flex justify-center items-center gap-2 mb-8">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep ? 'bg-primary w-6' : 'bg-border-light dark:border-border-dark'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
             <Button 
                onClick={handlePrev} 
                variant="outline"
                className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
                aria-label="Previous Step"
             >
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Kembali
             </Button>
            <Button onClick={handleNext} className="flex-1">
              {currentStep === tutorialSteps.length - 1 ? 'Selesai!' : 'Seterusnya'}
              {currentStep < tutorialSteps.length - 1 && <ArrowRightIcon className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      <style>{`
        @keyframes animate-fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: animate-fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};