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
        { id: 9, title: "Ikhfa", type: 'lesson', status: 'locked', stars: 0, xp: 50 },
        { id: 10, title: "Ujian Tajwid", type: 'test', status: 'locked', stars: 0, xp: 100 }
      ]
    },
    {
      id: 3,
      title: "Surah Pendek",
      description: "Juz 30 - Surah An-Nas hingga Ad-Duha",
      color: "bg-purple-500",
      icon: "🌙",
      isUnlocked: false,
      lessons: [
        { id: 11, title: "Surah An-Nas", type: 'lesson', status: 'locked', stars: 0, xp: 50 },
        { id: 12, title: "Surah Al-Falaq", type: 'lesson', status: 'locked', stars: 0, xp: 50 }
      ]
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-background dark:to-card">
      {/* Header Stats */}
      <div className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FlameIcon className="w-5 h-5 text-orange-500" />
              <span className="font-bold">{streak}</span>
            </div>
            <div className="flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">Level {level}</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-purple-500" />
              <span className="font-bold">{totalXP} XP</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
            Latihan
          </button>
        </div>
      </div>

      {/* Learning Path */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {units.map((unit) => (
            <div key={unit.id} className="relative">
              {/* Unit Header */}
              <div className={cn(unit.color, "rounded-2xl p-6 shadow-lg", !unit.isUnlocked && 'opacity-50')}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{unit.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
                    <p className="text-white/90">{unit.description}</p>
                  </div>
                  {!unit.isUnlocked && (
                    <LockIcon className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              {/* Lessons Path */}
              <div className="relative mt-6 space-y-6">
                {/* Connection Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-700 -translate-x-1/2 z-0" />

                {unit.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className={cn("relative flex", lessonIndex % 2 === 0 ? 'justify-start' : 'justify-end')}
                  >
                    <div
                      className={cn(
                        "w-5/12 transition-transform",
                        lesson.status === 'locked' 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:scale-105'
                      )}
                    >
                      <div className="bg-card rounded-2xl shadow-md p-4 border-2 border-border hover:border-primary/50">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getLessonEmoji(lesson.type)}</div>
                          <div className="flex-1">
                            <h3 className="font-bold">{lesson.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm">{lesson.xp} XP</span>
                              {lesson.stars > 0 && (
                                <div className="flex">
                                  {[...Array(3)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={cn(
                                        "w-4 h-4",
                                        i < lesson.stars 
                                          ? 'fill-yellow-400 text-yellow-400' 
                                          : 'text-gray-300 dark:text-gray-600'
                                      )}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {getLessonIcon(lesson)}
                        </div>
                      </div>
                    </div>

                    {/* Center Node */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className={cn("w-8 h-8 rounded-full border-4 border-card shadow-md",
                        lesson.status === 'perfect' && 'bg-yellow-400',
                        lesson.status === 'completed' && 'bg-green-500',
                        lesson.status === 'available' && 'bg-blue-500',
                        lesson.status === 'locked' && 'bg-gray-300 dark:bg-gray-600'
                      )} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Unit Checkpoint */}
              <div className="mt-8 flex justify-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-8 py-3 shadow-lg">
                  <div className="flex items-center gap-3 text-white">
                    <AwardIcon className="w-6 h-6" />
                    <span className="font-bold">Checkpoint Unit {unit.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-20">
          <button className="w-full max-w-md bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors text-lg">
            SAMBUNG BELAJAR →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;