import React, { useState } from 'react';
import type { StudyPlan } from '../types';
import { generateStudyPlan } from '../services/geminiService';
import { CalendarIcon, SparklesIcon } from './icons/Icons';

const PlanDisplay: React.FC<{ plan: StudyPlan }> = ({ plan }) => (
    <div className="mt-8 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold text-center mb-2 text-primary-light dark:text-primary-dark">{plan.plan_title}</h3>
        <p className="text-center text-foreground-light/80 mb-6">Jadual pembelajaran anda untuk {plan.duration_days} hari.</p>
        <div className="space-y-4">
            {plan.daily_plan.map((day) => (
                <div key={day.day} className="p-4 bg-black/10 rounded-lg">
                    <h4 className="font-bold text-lg">Hari {day.day}: {day.topic}</h4>
                    <p className="text-xs text-foreground-light/70 mb-3">{day.estimated_time}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {day.tasks.map((task, index) => <li key={index}>{task}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);

export const StudyPlanner: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('14 hari');
    const [level, setLevel] = useState('Permulaan');
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) {
            setError("Sila masukkan matlamat anda.");
            return;
        }
        setError(null);
        setIsLoading(true);
        setPlan(null);

        const result = await generateStudyPlan(goal, duration, level);
        if (result) {
            setPlan(result);
        } else {
            setError("Maaf, gagal menjana pelan. Sila cuba lagi.");
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-light dark:text-primary-dark mb-2 text-center">Pelan Pembelajaran AI</h2>
            <p className="text-foreground-light/80 mb-8 text-center">Biarkan AI merangka jadual hafazan atau pembelajaran yang sesuai untuk anda.</p>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium mb-1">Matlamat Pembelajaran</label>
                        <input
                            id="goal"
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="Cth: Menghafal Surah Al-Mulk, Memahami tema sabar dalam Al-Quran"
                            className="w-full p-2 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-light"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium mb-1">Tempoh</label>
                            <select id="duration" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-light">
                                <option>7 hari</option>
                                <option>14 hari</option>
                                <option>30 hari</option>
                                <option>90 hari</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="level" className="block text-sm font-medium mb-1">Tahap Semasa</label>
                             <select id="level" value={level} onChange={e => setLevel(e.target.value)} className="w-full p-2 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-light">
                                <option>Permulaan</option>
                                <option>Pertengahan</option>
                                <option>Mahir</option>
                            </select>
                        </div>
                    </div>
                    {error && <p className="text-primary-light text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-primary-light text-white dark:bg-primary-dark rounded-lg font-semibold hover:bg-primary-light/90 transition-colors disabled:bg-foreground-light/20">
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Menjana...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon />
                                <span>Jana Pelan</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
            {plan && <PlanDisplay plan={plan} />}
        </div>
    );
};