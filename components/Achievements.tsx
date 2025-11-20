import React, { useState } from 'react';
import { TrophyIcon, StarIcon, LockIcon, CheckCircleIcon, TargetIcon, FlameIcon, BookOpenIcon, UsersIcon, CrownIcon, AwardIcon } from './icons/Icons';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'social' | 'milestone' | 'special';
  icon: React.ReactNode;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number;
  target: number;
  unlocked: boolean;
  reward: {
    xp: number;
    gems: number;
    badge?: string;
  };
  unlockedDate?: string;
}

const Achievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const achievements: Achievement[] = [
    // Learning Achievements
    {
      id: 'first-lesson',
      title: 'Langkah Pertama',
      description: 'Selesaikan pelajaran pertama anda',
      category: 'learning',
      icon: <BookOpenIcon className="w-8 h-8" />,
      rarity: 'bronze',
      progress: 1,
      target: 1,
      unlocked: true,
      reward: { xp: 50, gems: 10 },
      unlockedDate: '2025-01-15'
    },
    {
      id: 'iqra-master',
      title: 'Master Iqra',
      description: 'Selesaikan Iqra 1-6',
      category: 'learning',
      icon: <BookOpenIcon className="w-8 h-8" />,
      rarity: 'gold',
      progress: 4,
      target: 6,
      unlocked: false,
      reward: { xp: 500, gems: 100, badge: 'Iqra Master' }
    },
    {
      id: 'tajweed-expert',
      title: 'Pakar Tajwid',
      description: 'Skor 100% dalam 10 ujian tajwid',
      category: 'learning',
      icon: <StarIcon className="w-8 h-8" />,
      rarity: 'platinum',
      progress: 6,
      target: 10,
      unlocked: false,
      reward: { xp: 1000, gems: 200, badge: 'Tajweed Expert' }
    },
    {
      id: 'hafiz-juz-30',
      title: 'Hafiz Juz 30',
      description: 'Hafaz semua surah dalam Juz 30',
      category: 'learning',
      icon: <CrownIcon className="w-8 h-8" />,
      rarity: 'diamond',
      progress: 12,
      target: 37,
      unlocked: false,
      reward: { xp: 5000, gems: 1000, badge: 'Hafiz Juz 30' }
    },

    // Milestone Achievements
    {
      id: 'week-warrior',
      title: 'Warrior Minggu',
      description: 'Streak 7 hari berturut-turut',
      category: 'milestone',
      icon: <FlameIcon className="w-8 h-8" />,
      rarity: 'silver',
      progress: 7,
      target: 7,
      unlocked: true,
      reward: { xp: 100, gems: 50 },
      unlockedDate: '2025-01-20'
    },
    {
      id: 'month-master',
      title: 'Master Sebulan',
      description: 'Streak 30 hari berturut-turut',
      category: 'milestone',
      icon: <FlameIcon className="w-8 h-8" />,
      rarity: 'gold',
      progress: 15,
      target: 30,
      unlocked: false,
      reward: { xp: 500, gems: 200, badge: 'Istiqamah Champion' }
    },
    {
      id: 'century-club',
      title: 'Century Club',
      description: 'Streak 100 hari!',
      category: 'milestone',
      icon: <TrophyIcon className="w-8 h-8" />,
      rarity: 'diamond',
      progress: 15,
      target: 100,
      unlocked: false,
      reward: { xp: 2000, gems: 500, badge: 'Century Master' }
    },
    {
      id: 'level-10',
      title: 'Level 10',
      description: 'Capai Level 10',
      category: 'milestone',
      icon: <TargetIcon className="w-8 h-8" />,
      rarity: 'silver',
      progress: 8,
      target: 10,
      unlocked: false,
      reward: { xp: 200, gems: 100 }
    },
  ];

  const categories = [
    { id: 'all', name: 'Semua', icon: TrophyIcon },
    { id: 'learning', name: 'Pembelajaran', icon: BookOpenIcon },
    { id: 'milestone', name: 'Milestone', icon: TargetIcon },
    { id: 'social', name: 'Sosial', icon: UsersIcon },
    { id: 'special', name: 'Istimewa', icon: CrownIcon }
  ];

  const rarityColors = {
    bronze: 'bg-orange-400',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-400',
    platinum: 'bg-cyan-400',
    diamond: 'bg-purple-400',
  };

  let filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  if (showUnlockedOnly) {
    filteredAchievements = filteredAchievements.filter(a => a.unlocked);
  }

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    totalXP: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward.xp, 0),
    totalGems: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward.gems, 0)
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
                Pencapaian & Lencana
              </h1>
              <p className="text-foreground/80 mt-1">Kumpul lencana dengan menyiapkan cabaran!</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-200 dark:bg-blue-800/50 rounded-xl p-4 text-center border-2 border-border">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.unlocked}/{stats.total}</div>
              <div className="text-sm mt-1">Pencapaian Dibuka</div>
            </div>
            <div className="bg-purple-200 dark:bg-purple-800/50 rounded-xl p-4 text-center border-2 border-border">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalXP}</div>
              <div className="text-sm mt-1">Total XP Diperoleh</div>
            </div>
            <div className="bg-pink-200 dark:bg-pink-800/50 rounded-xl p-4 text-center border-2 border-border">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.totalGems}</div>
              <div className="text-sm mt-1">Total Permata Diperoleh</div>
            </div>
            <div className="bg-yellow-200 dark:bg-yellow-800/50 rounded-xl p-4 text-center border-2 border-border">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {achievements.filter(a => a.unlocked && a.reward.badge).length}
              </div>
              <div className="text-sm mt-1">Lencana Eksklusif</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 border-2 border-border ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_hsl(var(--border))]'
                        : 'bg-background text-foreground hover:bg-foreground/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
               className={`px-4 py-2 rounded-xl font-semibold transition-all border-2 border-border ${
                showUnlockedOnly
                  ? 'bg-green-500 text-white'
                  : 'bg-background text-foreground hover:bg-foreground/10'
              }`}
            >
              {showUnlockedOnly ? '✓ Dibuka Sahaja' : 'Tunjuk Semua'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`bg-card rounded-2xl border-2 border-border overflow-hidden ${
                achievement.unlocked ? '' : 'opacity-75 grayscale'
              } transition-all`}
            >
              <div className={`${rarityColors[achievement.rarity]} py-1 text-center border-b-2 border-border`}>
                <span className="text-black text-xs font-bold uppercase tracking-wider">
                  {achievement.rarity}
                </span>
              </div>

              <div className="p-6">
                <div className="relative mb-4">
                  <div className={`${rarityColors[achievement.rarity]} p-4 rounded-xl inline-block border-2 border-border`}>
                    <div className="text-black">
                      {achievement.unlocked ? achievement.icon : <LockIcon className="w-8 h-8" />}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-sm mb-4 h-10">{achievement.description}</p>

                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">Progres</span>
                      <span className="text-sm font-bold text-primary">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="h-3 bg-background border-2 border-border rounded-full p-0.5 overflow-hidden">
                      <div
                        className={`${rarityColors[achievement.rarity]} h-full rounded-sm transition-all duration-500`}
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm mt-4">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold">{achievement.reward.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AwardIcon className="w-4 h-4 text-purple-500" />
                    <span className="font-bold">{achievement.reward.gems} Permata</span>
                  </div>
                </div>

                {achievement.unlockedDate && (
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Dibuka: {achievement.unlockedDate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
