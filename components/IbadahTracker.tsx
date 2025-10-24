
import React, { useState, useEffect } from 'react';
import { CheckSquareIcon } from './icons/Icons';

const ibadahList = [
  { id: 'fajr', label: 'Solat Subuh' },
  { id: 'dhuhr', label: 'Solat Zohor' },
  { id: 'asr', label: 'Solat Asar' },
  { id: 'maghrib', label: 'Solat Maghrib' },
  { id: 'isha', label: 'Solat Isyak' },
  { id: 'tahajjud', label: 'Solat Tahajjud' },
  { id: 'dhuha', label: 'Solat Dhuha' },
  { id: 'quran', label: 'Baca Al-Quran' },
  { id: 'zikr', label: 'Zikir Pagi & Petang' },
  { id: 'sadaqah', label: 'Sedekah' },
];

export const IbadahTracker: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  
  // Load from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const savedData = localStorage.getItem(`ibadahTracker_${today}`);
    if (savedData) {
      setCompleted(new Set(JSON.parse(savedData)));
    }
  }, []);

  const toggleIbadah = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);

    // Save to localStorage
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`ibadahTracker_${today}`, JSON.stringify(Array.from(newCompleted)));
  };
  
  const completionPercentage = Math.round((completed.size / ibadahList.length) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-2">Penjejak Ibadah Harian</h2>
        <p className="text-foreground-light/80">Tandakan amalan yang telah anda selesaikan hari ini.</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-primary-light dark:text-primary-dark">Selesai Hari Ini</span>
            <span className="text-sm font-medium text-primary-light dark:text-primary-dark">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-black/10 rounded-full h-2.5">
          <div className="bg-primary-light dark:bg-primary-dark h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>
      
      <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="space-y-3">
          {ibadahList.map(item => (
            <label
              key={item.id}
              htmlFor={item.id}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                completed.has(item.id)
                  ? 'bg-accent/10 dark:bg-accent/20 border-l-4 border-accent'
                  : 'bg-black/5 hover:bg-black/10'
              }`}
            >
              <input
                id={item.id}
                type="checkbox"
                checked={completed.has(item.id)}
                onChange={() => toggleIbadah(item.id)}
                className="w-5 h-5 rounded text-primary-light dark:text-primary-dark focus:ring-primary-light/50 bg-black/20 border-white/20"
              />
              <span className={`ml-4 text-lg font-medium ${completed.has(item.id) ? 'line-through text-foreground-light/50' : ''}`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};