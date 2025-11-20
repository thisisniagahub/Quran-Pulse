import React, { useState, useEffect } from 'react';
import type { PracticeMaterial, TajweedRule, TajweedSession } from '../types';
import { IqraBookView } from './IqraBookView';
import { getCache, setCache } from '../services/dbService';
import { TajweedRuleInfo } from './TajweedRuleInfo';
import { Button } from './ui/Button';
import { BookOpenIcon, SparklesIcon, ListIcon, HistoryIcon } from './icons/Icons';
import { getTajweedSessions } from '../services/dbService';
import { AgentSelector } from './ui/AgentSelector';
import { AGENT_DEFINITIONS } from '../lib/agents';
import { EmptyState } from './ui/EmptyState';
import { Skeleton } from './ui/Skeleton';

type SelectionMode = 'iqra' | 'rules' | 'history';
type AgentId = 'gemini' | 'glm';

interface TajweedSelectorProps {
    onSelectMaterial: (material: PracticeMaterial) => void;
    selectedAgentId: AgentId;
    onSelectAgent: (agentId: AgentId) => void;
}

const RulesSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        ))}
    </div>
);


export const TajweedSelector: React.FC<TajweedSelectorProps> = ({ onSelectMaterial, selectedAgentId, onSelectAgent }) => {
    const [mode, setMode] = useState<SelectionMode>('iqra');
    const [selectedRule, setSelectedRule] = useState<TajweedRule | null>(null);
    const [history, setHistory] = useState<TajweedSession[]>([]);
    const [tajweedRulesData, setTajweedRulesData] = useState<TajweedRule[]>([]);
    const [isLoadingRules, setIsLoadingRules] = useState(true);

    const agentSet = AGENT_DEFINITIONS.tajweedFeedback;

    useEffect(() => {
        const loadRules = async () => {
            if (mode === 'rules' && tajweedRulesData.length === 0) {
                setIsLoadingRules(true);
                try {
                    const cachedData = await getCache('tajweedRulesData');
                    if (cachedData) {
                        setTajweedRulesData(cachedData);
                    } else {
                        const response = await fetch('/data/tajweedRulesData.json');
                        const data = await response.json();
                        setTajweedRulesData(data);
                        await setCache('tajweedRulesData', data);
                    }
                } catch (error) {
                    console.error("Failed to load Tajweed rules", error);
                } finally {
                    setIsLoadingRules(false);
                }
            }
        };
        loadRules();
    }, [mode, tajweedRulesData]);

    useEffect(() => {
        if (mode === 'history') {
            const fetchHistory = async () => {
                const sessions = await getTajweedSessions();
                const sortedSessions = sessions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setHistory(sortedSessions);
            };
            fetchHistory();
        }
    }, [mode]);

    const handleSelectRuleExample = (ruleName: string, example: { arabic: string }) => {
        onSelectMaterial({
            title: `Latihan ${ruleName}: ${example.arabic}`,
            content: example.arabic,
            type: 'quran'
        });
    };
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minit lalu";
        return "Baru sahaja";
    };

    const renderContent = () => {
        switch (mode) {
            case 'iqra':
                return <IqraBookView onSelectMaterial={onSelectMaterial} onBack={() => {}} />;
            case 'rules':
                if (isLoadingRules) {
                    return <RulesSkeleton />;
                }
                return (
                    <div className="space-y-4">
                        {tajweedRulesData.map(rule => (
                            <div key={rule.id} className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold">{rule.name}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedRule(rule)}>Info</Button>
                                </div>
                                <p className="text-sm text-foreground-light/80 mt-1">{rule.description}</p>
                                <div className="mt-4 space-y-2">
                                    {rule.examples.map((ex, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-md">
                                            <p className="font-arabic text-xl">{ex.arabic}</p>
                                            <Button size="sm" onClick={() => handleSelectRuleExample(rule.name, ex)}>Praktis</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
             case 'history':
                if (history.length === 0) {
                    return (
                        <EmptyState
                            title="Tiada Sejarah Latihan"
                            description="Sesi latihan Tajwid anda yang telah selesai akan muncul di sini."
                        />
                    );
                }
                return (
                     <div className="space-y-4">
                        {history.map(session => (
                            <div key={session.id} className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{session.material.title}</p>
                                    <p className="text-sm text-foreground-light/70">{timeAgo(session.timestamp!)}</p>
                                    {session.accuracy !== undefined && (
                                        <p className={`text-sm font-semibold ${session.accuracy >= 85 ? 'text-green-500' : 'text-yellow-500'}`}>
                                            Skor: {session.accuracy}%
                                        </p>
                                    )}
                                </div>
                                <Button onClick={() => onSelectMaterial(session.material)}>Ulang Latihan</Button>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Tutor Tajwid AI (PRO)</h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Pilih bahan latihan dan jurulatih AI untuk memulakan sesi anda.</p>
            </div>

            <div className="mb-4">
                 <AgentSelector 
                    agents={Object.values(agentSet)}
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={onSelectAgent}
                    title="Pilih Jurulatih AI Anda"
                />
            </div>
            
            <div className="flex justify-center gap-2 mb-6 p-1 bg-card-light dark:bg-card-dark rounded-lg">
                <Button onClick={() => setMode('iqra')} variant={mode === 'iqra' ? 'secondary' : 'ghost'} className="gap-2"><BookOpenIcon className="w-4 h-4" /> Iqra'</Button>
                <Button onClick={() => setMode('rules')} variant={mode === 'rules' ? 'secondary' : 'ghost'} className="gap-2"><SparklesIcon className="w-4 h-4" /> Hukum Tajwid</Button>
                <Button onClick={() => setMode('history')} variant={mode === 'history' ? 'secondary' : 'ghost'} className="gap-2"><HistoryIcon className="w-4 h-4" /> Sejarah</Button>
            </div>

            {renderContent()}

            {selectedRule && <TajweedRuleInfo rule={selectedRule} onClose={() => setSelectedRule(null)} />}
        </div>
    );
};

export default TajweedSelector;