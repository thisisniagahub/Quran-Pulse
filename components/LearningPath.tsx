import React, { useState } from 'react';
import { StarIcon, LockIcon, CheckCircleIcon, AwardIcon, FlameIcon, CircleIcon } from './icons/Icons';
import { cn } from '../lib/utils';

interface Lesson {
  id: number;
  title: string;
  type: 'lesson' | 'practice' | 'test' | 'story';
  status: 'locked' | 'available' | 'completed' | 'perfect';
  stars: number;
  xp: number;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: Lesson[];
  isUnlocked: boolean;
}

const LearningPath: React.FC = () => {
  const [streak, setStreak] = useState(15);
  const [totalXP, setTotalXP] = useState(2450);
  const [level, setLevel] = useState(8);

  const units: Unit[] = [
    {
      id: 1,
      title: "Iqra' Jilid 1",
      description: "Asas Huruf Hijaiyyah",
      color: "bg-green-500",
      icon: "📖",
      isUnlocked: true,
      lessons: [
        { id: 1, title: "Huruf Alif - Ya", type: 'lesson', status: 'perfect', stars: 3, xp: 50 },
        { id: 2, title: "Latihan Huruf", type: 'practice', status: 'completed', stars: 2, xp: 30 },
        { id: 3, title: "Ujian Unit 1", type: 'test', status: 'completed', stars: 3, xp: 100 },
        { id: 4, title: "Huruf Ba - Ta", type: 'lesson', status: 'available', stars: 0, xp: 50 },
        { id: 5, title: "Kisah Nabi Adam", type: 'story', status: 'locked', stars: 0, xp: 75 }
      ]
    },
    {
      id: 2,
      title: "Tajwid Asas",
      description: "Hukum Nun Mati & Tanwin",
      color: "bg-blue-500",
      icon: "📚",
      isUnlocked: true,
      lessons: [
        { id: 6, title: "Izhar", type: 'lesson', status: 'completed', stars: 2, xp: 50 },
        { id: 7, title: "Idgham", type: 'lesson', status: 'available', stars: 0, xp: 50 },
        { id: 8, title: "Iqlab", type: 'lesson', status: 'locked', stars: 0, xp: 50 },
      ]
    },
  ];

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.status === 'perfect') return <StarIcon className="w-6 h-6 fill-yellow-400 text-yellow-400" />;
    if (lesson.status === 'completed') return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    if (lesson.status === 'available') return <CircleIcon className="w-6 h-6 text-gray-400" />;
    return <LockIcon className="w-6 h-6 text-gray-300 dark:text-gray-500" />;
  };

  const getLessonEmoji = (type: string) => {
    switch(type) {
      case 'lesson': return '📖';
      case 'practice': return '✍️';
      case 'test': return '🎯';
      case 'story': return '📚';
      default: return '📖';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b-2 border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-bold"><FlameIcon className="w-5 h-5 text-orange-500" />{streak}</div>
            <div className="flex items-center gap-2 font-bold"><AwardIcon className="w-5 h-5 text-yellow-500" />Level {level}</div>
            <div className="flex items-center gap-2 font-bold"><StarIcon className="w-5 h-5 text-purple-500" />{totalXP} XP</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {units.map((unit) => (
            <div key={unit.id} className="relative">
              <div className={cn(unit.color, "rounded-2xl p-6 border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]", !unit.isUnlocked && 'opacity-50')}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{unit.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-black">{unit.title}</h2>
                    <p className="text-black/90">{unit.description}</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 space-y-6">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 z-0" />

                {unit.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className={cn("relative flex", lessonIndex % 2 === 0 ? 'justify-start' : 'justify-end')}>
                    <div className={cn("w-5/12", lesson.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
                      <div className="bg-card rounded-2xl p-4 border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getLessonEmoji(lesson.type)}</div>
                          <div className="flex-1"><h3 className="font-bold">{lesson.title}</h3></div>
                          {getLessonIcon(lesson)}
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className={cn("w-8 h-8 rounded-full border-4 border-card shadow-md",
                        lesson.status === 'perfect' && 'bg-yellow-400',
                        lesson.status === 'completed' && 'bg-green-500',
                        lesson.status === 'available' && 'bg-blue-500',
                        lesson.status === 'locked' && 'bg-gray-400'
                      )} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        <div className="fixed bottom-24 left-0 right-0 flex justify-center px-4 z-20 md:bottom-6">
          <button className="w-full max-w-md bg-green-500 text-black font-bold py-4 rounded-xl border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))] active:shadow-none active:translate-y-1 transition-all text-lg">
            SAMBUNG BELAJAR →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
