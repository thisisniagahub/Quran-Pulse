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
    {
      id: '3',
      title: "Latihan Tajwid",
      description: "Selesaikan 3 latihan tajwid",
      progress: 2,
      target: 3,
      xp: 50,
      gems: 15,
      icon: <ZapIcon className="w-6 h-6 text-yellow-500" />,
      completed: false
    }
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
    {
      id: 'c2',
      title: "Hafazan Juz 30",
      type: 'monthly',
      description: "Hafaz 10 surah pendek",
      progress: 6,
      target: 10,
      reward: { xp: 1000, gems: 500, special: "Trofi Master Juz 30" },
      timeLeft: "18 hari",
      difficulty: 'hard'
    },
    {
      id: 'c3',
      title: "Ramadan Kareem 🌙",
      type: 'special',
      description: "Khatam Al-Quran dalam Ramadan",
      progress: 12,
      target: 30,
      reward: { xp: 5000, gems: 2000, special: "Mahkota Juara Ramadan" },
      timeLeft: "15 hari",
      difficulty: 'extreme'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'hard': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      case 'extreme': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-purple-500';
      case 'monthly': return 'bg-pink-500';
      case 'special': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const progressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Matlamat & Cabaran</h1>
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 dark:bg-orange-500/20 px-4 py-2 rounded-full">
              <span className="text-orange-600 dark:text-orange-400 font-bold">🔥 {streak} hari</span>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress Bar */}
        <div className="bg-background rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Progres Harian</span>
            <span className="text-sm font-bold text-primary">{currentXP} / {dailyGoal} XP</span>
          </div>
          <div className="relative h-4 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage(currentXP, dailyGoal)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-center">
            {dailyGoal - currentXP > 0 
              ? `${dailyGoal - currentXP} XP lagi untuk capai sasaran!` 
              : '🎉 Sasaran hari ini tercapai!'}
          </div>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TargetIcon className="w-6 h-6 text-blue-500" />
          Matlamat Hari Ini
        </h2>
        <div className="space-y-4">
          {goals.map(goal => (
            <div
              key={goal.id}
              className={`border-2 rounded-xl p-4 transition-all ${
                goal.completed 
                  ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30' 
                  : 'bg-background border-border hover:border-border/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${goal.completed ? 'bg-green-100 dark:bg-green-500/20' : 'bg-foreground/5'}`}>
                  {goal.completed ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    goal.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{goal.title}</h3>
                  <p className="text-sm">{goal.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{goal.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <GiftIcon className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold">{goal.gems} Permata</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {goal.progress}/{goal.target}
                  </div>
                  {!goal.completed && (
                    <div className="w-24 h-2 bg-foreground/10 rounded-full mt-2">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progressPercentage(goal.progress, goal.target)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          Cabaran Aktif
        </h2>
        <div className="space-y-4">
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className="border-2 border-border rounded-xl p-5 hover:border-border/50 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className={`${getTypeColor(challenge.type)} p-4 rounded-xl shadow-md`}>
                  <TrophyIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{challenge.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <p className="mb-3">{challenge.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">Progres</span>
                      <span className="text-sm font-bold text-primary">
                        {challenge.progress} / {challenge.target}
                      </span>
                    </div>
                    <div className="h-3 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getTypeColor(challenge.type)} transition-all duration-500`}
                        style={{ width: `${progressPercentage(challenge.progress, challenge.target)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rewards & Time */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold">{challenge.reward.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GiftIcon className="w-5 h-5 text-purple-500" />
                        <span className="font-bold">{challenge.reward.gems} Permata</span>
                      </div>
                      {challenge.reward.special && (
                        <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 rounded-full">
                          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">🏆 {challenge.reward.special}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Masa Berbaki</div>
                      <div className="font-bold text-red-600">{challenge.timeLeft}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Daily Goal */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <h3 className="font-bold mb-4">Laraskan Sasaran Harian</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-medium">XP per hari:</span>
          <button
            onClick={() => setDailyGoal(Math.max(10, dailyGoal - 10))}
            className="px-4 py-2 bg-background rounded-lg font-bold hover:bg-background/80"
          >
            -
          </button>
          <span className="text-2xl font-bold text-primary min-w-[60px] text-center">{dailyGoal}</span>
          <button
            onClick={() => setDailyGoal(Math.min(200, dailyGoal + 10))}
            className="px-4 py-2 bg-background rounded-lg font-bold hover:bg-background/80"
          >
            +
          </button>
          <div className="ml-auto flex gap-2">
            {[10, 20, 50, 100].map(preset => (
              <button
                key={preset}
                onClick={() => setDailyGoal(preset)}
                className={`px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  dailyGoal === preset 
                    ? 'bg-primary text-white' 
                    : 'bg-background hover:bg-background/80'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm mt-3">
          💡 Tip: Mulakan dengan sasaran kecil dan tingkatkan secara beransur-ansur untuk kekal konsisten!
        </p>
      </div>
    </div>
  );
};

export default DailyGoals;