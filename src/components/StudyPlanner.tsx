import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { addStudyPlan, getStudyPlans } from '../services/dbService';
import type { StudyPlan } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { SparklesIcon, CalendarIcon, ListIcon, HistoryIcon, SaveIcon } from './icons/Icons';
import { AgentSelector } from './ui/AgentSelector';
import { AGENT_DEFINITIONS } from '../lib/agents';
import type { Agent } from '../lib/agents';
import { useToast } from '../context/ToastContext';

type PlannerView = 'form' | 'plan' | 'history';
type AgentId = 'gemini' | 'glm';

export const StudyPlanner: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('7 hari');
  const [level, setLevel] = useState('Beginner');
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<PlannerView>('form');
  const [savedPlans, setSavedPlans] = useState<StudyPlan[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');
  const { addToast } = useToast();

  const agentSet = AGENT_DEFINITIONS.studyPlanner;
  const activeAgent: Agent = agentSet[selectedAgentId];
  
  useEffect(() => {
    if (view === 'history') {
      loadHistory();
    }
  }, [view]);

  const loadHistory = async () => {
    const plans = await getStudyPlans();
    setSavedPlans(plans.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) {
      setError('Sila masukkan matlamat pembelajaran anda.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    const plan = await generateStudyPlan(goal, duration, level, activeAgent);
    if (plan) {
      setGeneratedPlan({ ...plan, goal, duration, level });
      setView('plan');
    } else {
      setError('Maaf, tidak dapat menjana pelan. Sila cuba lagi.');
    }
    setIsLoading(false);
  };
  
  const handleSavePlan = async () => {
    if (generatedPlan) {
        await addStudyPlan(generatedPlan);
        addToast({
            type: 'success',
            title: 'Pelan Disimpan',
            description: 'Pelan belajar anda telah disimpan ke dalam sejarah.',
        });
    }
  };

  const renderForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Cipta Pelan Belajar Anda</CardTitle>
      </CardHeader>
      <CardContent>
        <AgentSelector 
            agents={Object.values(agentSet)}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            title="Pilih Jurulatih AI"
        />
        <form onSubmit={handleGeneratePlan} className="space-y-6 mt-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium mb-2">Apakah matlamat utama anda? (cth: Belajar asas Tajwid, Hafal Juz 30)</label>
            <input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary"
              placeholder="Contoh: Ingin lancar membaca Surah Al-Mulk"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-2">Tempoh masa?</label>
            <select id="duration" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
              <option>7 hari</option>
              <option>14 hari</option>
              <option>30 hari</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-2">Tahap semasa anda?</label>
            <select id="level" value={level} onChange={e => setLevel(e.target.value)} className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
              <option>Baru Mula (Beginner)</option>
              <option>Pertengahan (Intermediate)</option>
              <option>Maju (Advanced)</option>
            </select>
          </div>
          {error && <p className="text-sm text-primary">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full gap-2">
            {isLoading ? "Menjana..." : <><SparklesIcon /> Janakan Pelan</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderPlan = (plan: StudyPlan) => (
    <div>
        <div className="flex justify-between items-center mb-4">
             <Button onClick={() => { setView('form'); setGeneratedPlan(null); }} variant="ghost"><CalendarIcon /> Cipta Pelan Baru</Button>
             <Button onClick={handleSavePlan}><SaveIcon className="w-4 h-4 mr-2"/> Simpan Pelan Ini</Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>{plan.plan_title}</CardTitle>
                <p className="text-sm text-foreground-light/80">{plan.duration_days} Hari • {plan.level}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {plan.daily_plan.map(day => (
                        <div key={day.day} className="p-4 border border-border-light dark:border-border-dark rounded-lg">
                            <h4 className="font-bold">Hari {day.day}: {day.topic}</h4>
                            <p className="text-xs text-foreground-light/70 mb-2">Anggaran masa: {day.estimated_time}</p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
  
  const renderHistory = () => (
    <div>
        <Button onClick={() => setView('form')} variant="ghost" className="mb-4"><CalendarIcon /> Cipta Pelan Baru</Button>
        {savedPlans.length > 0 ? (
            <div className="space-y-4">
                {savedPlans.map(plan => (
                    <Card key={plan.id} className="cursor-pointer hover:border-primary" onClick={() => { setGeneratedPlan(plan); setView('plan'); }}>
                        <CardContent className="p-4">
                            <h3 className="font-bold">{plan.plan_title}</h3>
                            <p className="text-sm text-foreground-light/80">{new Date(plan.timestamp!).toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : <p>Tiada pelan yang disimpan.</p>}
    </div>
  );
  
  const renderContent = () => {
    switch(view) {
        case 'plan': return generatedPlan && renderPlan(generatedPlan);
        case 'history': return renderHistory();
        case 'form':
        default: return renderForm();
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Pelan Belajar AI (PRO)</h2>
        <p className="text-foreground-light/80 dark:text-foreground-dark/80">Rancang perjalanan pembelajaran Al-Quran anda dengan bantuan AI.</p>
      </div>
       <div className="flex justify-center gap-2 mb-6 p-1 bg-card-light dark:bg-card-dark rounded-lg">
            <Button onClick={() => setView('form')} variant={view === 'form' ? 'secondary' : 'ghost'} className="gap-2"><SparklesIcon className="w-4 h-4" /> Cipta</Button>
            <Button onClick={() => setView('history')} variant={view === 'history' ? 'secondary' : 'ghost'} className="gap-2"><HistoryIcon className="w-4 h-4" /> Sejarah</Button>
        </div>
      {renderContent()}
    </div>
  );
};

export default StudyPlanner;
