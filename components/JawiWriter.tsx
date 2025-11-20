import React, { useState, useEffect } from 'react';
import { convertToJawi } from '../services/geminiService';
import { addJawiConversion, getJawiConversions } from '../services/dbService';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { PencilIcon, HistoryIcon, SparklesIcon } from './icons/Icons';
import type { JawiConversion } from '../types';
import { AgentSelector } from './ui/AgentSelector';
import { AGENT_DEFINITIONS } from '../lib/agents';
import type { Agent } from '../lib/agents';
import { EmptyState } from './ui/EmptyState';

type AgentId = 'gemini' | 'glm';

export const JawiWriter: React.FC = () => {
    const [rumiText, setRumiText] = useState('');
    const [jawiText, setJawiText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<JawiConversion[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');

    const agentSet = AGENT_DEFINITIONS.jawiWriter;
    const activeAgent: Agent = agentSet[selectedAgentId];

    useEffect(() => {
        if (showHistory) {
            const fetchHistory = async () => {
                const conversions = await getJawiConversions();
                setHistory(conversions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
            };
            fetchHistory();
        }
    }, [showHistory]);

    const handleConvert = async () => {
        if (!rumiText.trim()) return;
        setIsLoading(true);
        setJawiText('');
        try {
            const converted = await convertToJawi(rumiText, activeAgent);
            setJawiText(converted);
            await addJawiConversion({ rumi: rumiText, jawi: converted });
        } catch (error) {
            console.error(error);
            setJawiText("Maaf, berlaku ralat semasa penukaran.");
        }
        setIsLoading(false);
    };

    const handleHistoryClick = (item: JawiConversion) => {
        setRumiText(item.rumi);
        setJawiText(item.jawi);
        setShowHistory(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Penulis Jawi AI (PRO)</h2>
                <p className="text-foreground/80">Tukar teks Rumi ke tulisan Jawi dengan mudah.</p>
            </div>
            
            <div className="mb-4">
                <AgentSelector 
                    agents={Object.values(agentSet)}
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={setSelectedAgentId}
                    title="Pilih Enjin Penukaran"
                />
            </div>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="rumi" className="block font-semibold mb-2">Teks Rumi</label>
                            <textarea
                                id="rumi"
                                rows={6}
                                value={rumiText}
                                onChange={(e) => setRumiText(e.target.value)}
                                className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
                                placeholder="Taip di sini..."
                            />
                        </div>
                        <div dir="rtl">
                            <label htmlFor="jawi" className="block font-semibold mb-2 text-right">Teks Jawi</label>
                            <div id="jawi" className="w-full h-full min-h-[150px] p-3 rounded-lg border border-border bg-background font-arabic text-xl">
                                {isLoading ? "Menukar..." : jawiText}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <Button onClick={() => setShowHistory(!showHistory)} variant="ghost" className="gap-2">
                           <HistoryIcon /> Sejarah
                        </Button>
                        <Button onClick={handleConvert} disabled={isLoading || !rumiText.trim()} className="gap-2">
                           <SparklesIcon /> {isLoading ? '...' : 'Tukar ke Jawi'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showHistory && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4">Sejarah Penukaran</h3>
                        {history.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {history.map(item => (
                                    <div key={item.id} onClick={() => handleHistoryClick(item)} className="p-3 bg-background rounded-lg cursor-pointer hover:bg-primary/10">
                                        <p className="truncate font-semibold">{item.rumi}</p>
                                        <p className="text-right font-arabic text-primary truncate">{item.jawi}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Tiada Sejarah Ditemui"
                                description="Setiap penukaran yang anda lakukan akan disimpan di sini untuk rujukan masa hadapan."
                             />
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default JawiWriter;