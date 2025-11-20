import React, { useState } from 'react';
import { TrophyIcon, MedalIcon, CrownIcon, TrendingUpIcon, UsersIcon, GlobeIcon, MapPinIcon, AwardIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';
import { cn } from '../lib/utils';

interface Player {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  country: string;
  isYou?: boolean;
  change: number; // Position change from last week
}

interface League {
  name: string;
  icon: string;
  color: string;
  minXP: number;
}

const Leaderboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'friends' | 'local' | 'global'>('friends');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'alltime'>('week');

  const currentLeague: League = {
    name: 'Gold League',
    icon: '🥇',
    color: 'from-yellow-400 to-yellow-600',
    minXP: 5000
  };

  const leagues: League[] = [
    { name: 'Bronze', icon: '🥉', color: 'from-orange-700 to-orange-900', minXP: 0 },
    { name: 'Silver', icon: '🥈', color: 'from-gray-400 to-gray-600', minXP: 1000 },
    { name: 'Gold', icon: '🥇', color: 'from-yellow-400 to-yellow-600', minXP: 5000 },
    { name: 'Diamond', icon: '💎', color: 'from-cyan-400 to-blue-500', minXP: 20000 },
    { name: 'Legendary', icon: '👑', color: 'from-purple-400 to-pink-500', minXP: 50000 }
  ];

  const players: Player[] = [
    { rank: 1, name: 'Ahmad Rifqi', avatar: '👨', xp: 2450, streak: 45, country: 'MY', change: 2 },
    { rank: 2, name: 'Siti Nurhaliza', avatar: '👩', xp: 2380, streak: 38, country: 'MY', change: -1 },
    { rank: 3, name: 'Muhammad Hakim', avatar: '👨', xp: 2250, streak: 32, country: 'MY', change: 0 },
    { rank: 4, name: 'Aisyah Binti Ali', avatar: '👩', xp: 2100, streak: 28, country: 'MY', change: 3 },
    { rank: 5, name: 'Anda', avatar: '😊', xp: 1980, streak: 15, country: 'MY', isYou: true, change: 1 },
    { rank: 6, name: 'Zulkifli Hassan', avatar: '👨', xp: 1850, streak: 22, country: 'MY', change: -2 },
    { rank: 7, name: 'Nurul Iman', avatar: '👩', xp: 1720, streak: 18, country: 'MY', change: 0 },
    { rank: 8, name: 'Farhan Abdullah', avatar: '👨', xp: 1650, streak: 15, country: 'MY', change: 1 },
    { rank: 9, name: 'Mariam Yusof', avatar: '👩', xp: 1580, streak: 12, country: 'MY', change: -1 },
    { rank: 10, name: 'Ibrahim Ismail', avatar: '👨', xp: 1520, streak: 10, country: 'MY', change: 2 }
  ];
  
  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <div className="flex items-center gap-1 text-green-600"><ChevronUpIcon className="w-4 h-4" /><span className="text-xs font-bold">+{change}</span></div>;
    }
    if (change < 0) {
      return <div className="flex items-center gap-1 text-red-600"><ChevronDownIcon className="w-4 h-4" /><span className="text-xs font-bold">{change}</span></div>;
    }
    return <span className="text-xs text-gray-400">-</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`bg-gradient-to-r ${currentLeague.color} rounded-2xl shadow-lg p-6 mb-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl mb-2">{currentLeague.icon}</div>
            <h2 className="text-2xl font-bold">{currentLeague.name}</h2>
            <p className="text-white/90 text-sm">Bertanding dengan 29 peserta lain</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">1,980 XP</div>
            <div className="text-sm text-white/90">Ranking: #5</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-6 p-1 bg-card rounded-lg">
        <button onClick={() => setSelectedTab('friends')} className={cn("flex-1 md:flex-none gap-2 px-4 py-2 rounded-md font-semibold flex items-center justify-center", selectedTab === 'friends' ? 'bg-primary text-white' : 'hover:bg-primary/10')}><UsersIcon className="w-4 h-4"/>Rakan</button>
        <button onClick={() => setSelectedTab('local')} className={cn("flex-1 md:flex-none gap-2 px-4 py-2 rounded-md font-semibold flex items-center justify-center", selectedTab === 'local' ? 'bg-primary text-white' : 'hover:bg-primary/10')}><MapPinIcon className="w-4 h-4"/>Malaysia</button>
        <button onClick={() => setSelectedTab('global')} className={cn("flex-1 md:flex-none gap-2 px-4 py-2 rounded-md font-semibold flex items-center justify-center", selectedTab === 'global' ? 'bg-primary text-white' : 'hover:bg-primary/10')}><GlobeIcon className="w-4 h-4"/>Global</button>
      </div>

      {/* Period Filter */}
      <div className="p-4 border-b border-border flex gap-2">
          {['week', 'month', 'alltime'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                selectedPeriod === period
                  ? 'bg-primary text-white'
                  : 'bg-background hover:bg-background/80'
              }`}
            >
              {period === 'week' && 'Minggu Ini'}
              {period === 'month' && 'Bulan Ini'}
              {period === 'alltime' && 'Sepanjang Masa'}
            </button>
          ))}
        </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-2 md:gap-4 mb-6">
        {/* 2nd Place */}
        <div className="text-center w-1/4">
            <div className="bg-gray-300 dark:bg-gray-600 p-4 rounded-t-xl h-40 flex flex-col justify-end border-b-8 border-gray-400">
                <div className="text-5xl mb-2">{topThree[1].avatar}</div>
                <div className="font-bold truncate text-sm">{topThree[1].name}</div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{topThree[1].xp.toLocaleString()} XP</div>
            </div>
        </div>
        {/* 1st Place */}
        <div className="text-center w-1/3">
            <div className="bg-yellow-400 dark:bg-yellow-500 p-4 rounded-t-xl h-56 flex flex-col justify-end border-b-8 border-yellow-500 dark:border-yellow-600">
                <CrownIcon className="w-8 h-8 mx-auto text-yellow-800 dark:text-yellow-200 mb-2"/>
                <div className="text-6xl mb-2">{topThree[0].avatar}</div>
                <div className="font-bold text-lg truncate">{topThree[0].name}</div>
                <div className="text-md font-bold text-yellow-800 dark:text-yellow-100">{topThree[0].xp.toLocaleString()} XP</div>
            </div>
        </div>
        {/* 3rd Place */}
        <div className="text-center w-1/4">
            <div className="bg-orange-400 dark:bg-orange-700 p-4 rounded-t-xl h-32 flex flex-col justify-end border-b-8 border-orange-500">
                <div className="text-4xl mb-2">{topThree[2].avatar}</div>
                <div className="font-bold truncate text-xs">{topThree[2].name}</div>
                <div className="text-xs font-bold text-orange-800 dark:text-orange-200">{topThree[2].xp.toLocaleString()} XP</div>
            </div>
        </div>
      </div>
      
      {/* Rest of Leaderboard */}
      <div className="bg-card rounded-2xl shadow-sm">
        <div className="divide-y divide-border">
          {restOfPlayers.map((player) => (
            <div key={player.rank} className={cn("p-4 flex items-center gap-4 transition-colors", player.isYou && 'bg-primary/10')}>
              <div className="w-8 text-center font-bold text-foreground/70">{player.rank}</div>
              <div className="text-4xl">{player.avatar}</div>
              <div className="flex-1">
                <div className="font-bold">{player.name}</div>
                <div className="text-sm text-foreground/70">🔥 {player.streak} hari</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{player.xp.toLocaleString()} XP</div>
                {getChangeIndicator(player.change)}
              </div>
            </div>
          ))}
        </div>
      </div>
       {/* Promotion/Relegation Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800 dark:text-green-400">Zona Promosi</h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Top 10 akan naik ke <span className="font-bold">Diamond League</span> minggu depan!
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChevronDownIcon className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800 dark:text-red-400">Zona Degradasi</h3>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            Bottom 5 akan turun ke <span className="font-bold">Silver League</span>. Jangan lepaskan!
          </p>
        </div>
      </div>

      {/* Weekly Reset Timer */}
      <div className="mt-6 bg-card rounded-xl shadow-sm p-4 text-center">
        <p className="text-foreground/80 mb-2">Reset Mingguan Dalam</p>
        <div className="text-3xl font-bold text-primary">
          3 hari 14 jam 23 minit
        </div>
        <p className="text-sm text-foreground/70 mt-2">
          💡 Kumpul XP sebanyak mungkin sebelum reset!
        </p>
      </div>

      {/* All Leagues */}
      <div className="mt-6 bg-card rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          Semua League
        </h3>
        <div className="space-y-3">
          {leagues.map((league) => (
            <div
              key={league.name}
              className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                league.name === currentLeague.name
                  ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-600/30'
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{league.icon}</div>
                <div>
                  <div className="font-bold">{league.name} League</div>
                  <div className="text-sm text-foreground/80">
                    {league.minXP.toLocaleString()}+ XP diperlukan
                  </div>
                </div>
              </div>
              {league.name === currentLeague.name && (
                <div className="px-3 py-1 bg-yellow-400 rounded-full">
                  <span className="text-sm font-bold text-yellow-900">SEMASA</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;