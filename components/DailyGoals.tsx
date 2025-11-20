import React, { useState } from 'react';
import { TargetIcon, TrophyIcon, ClockIcon, ZapIcon, CheckCircleIcon, GiftIcon, StarIcon } from './icons/Icons';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xp: number;
  gems: number;
  icon: React.ReactNode;
  completed: boolean;
}

interface Challenge {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  description: string;
  progress: number;
  target: number;
  reward: {
    xp: number;
    gems: number;
    special?: string;
  };
  timeLeft: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

const DailyGoals: React.FC = () => {
  const [dailyGoal, setDailyGoal] = useState(20); // XP target
  const [currentXP, setCurrentXP] = useState(15);
  const [streak, setStreak] = useState(15);

  const goals: Goal[] = [
    {
      id: '1',
      title: "Sasaran Harian",
      description: `Kumpul ${dailyGoal} XP hari ini`,
      progress: currentXP,
      target: dailyGoal,
      xp: 10,
      gems: 5,
      icon: <TargetIcon className="w-6 h-6 text-blue-500" />,
      completed: currentXP >= dailyGoal
    },
    {
      id: '2',
      title: "Bacaan Pagi",
      description: "Baca 1 surah sebelum jam 12 tengahari",
      progress: 0,
      target: 1,
      xp: 30,
      gems: 10,
      icon: <ClockIcon className="w-6 h-6 text-orange-500" />,
      completed: false
    },
  ];

  const challenges: Challenge[] = [
    {
      id: 'c1',
      title: "Marathon Mingguan",
      type: 'weekly',
      description: "Kumpul 500 XP minggu ini",
      progress: 320,
      target: 500,
      reward: { xp: 200, gems: 100, special: "Lencana Lagenda" },
      timeLeft: "3 hari",
      difficulty: 'medium'
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-300 text-green-900';
      case 'medium': return 'bg-yellow-300 text-yellow-900';
      case 'hard': return 'bg-orange-400 text-orange-900';
      case 'extreme': return 'bg-red-400 text-red-900';
      default: return 'bg-gray-300 text-gray-900';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-purple-500';
      case 'monthly': return 'bg-pink-500';
      case 'special': return 'bg-yellow-400';
      default: return 'bg-gray-500';
    }
  };

  const progressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Matlamat & Cabaran</h1>
        </div>

        <div className="bg-background rounded-xl p-4 border-2 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Progres Harian</span>
            <span className="text-sm font-bold text-primary">{currentXP} / {dailyGoal} XP</span>
          </div>
          <div className="relative h-4 bg-foreground/10 rounded-md overflow-hidden border-2 border-border">
            <div className="absolute h-full bg-primary transition-all duration-500" style={{ width: `${progressPercentage(currentXP, dailyGoal)}%` }}/>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TargetIcon className="w-6 h-6 text-blue-500" />
          Matlamat Hari Ini
        </h2>
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id}
              className={`border-2 rounded-xl p-4 transition-all ${goal.completed ? 'bg-green-300 border-border' : 'bg-background border-border'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border-2 border-border ${goal.completed ? 'bg-green-200' : 'bg-foreground/5'}`}>
                  {goal.completed ? <CheckCircleIcon className="w-6 h-6 text-green-800" /> : goal.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{goal.title}</h3>
                  <p className="text-sm">{goal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          Cabaran Aktif
        </h2>
        <div className="space-y-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className="border-2 border-border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className={`${getTypeColor(challenge.type)} p-4 rounded-xl border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))]`}>
                  <TrophyIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{challenge.title}</h3>
                  </div>
                  <p className="mb-3">{challenge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyGoals;
