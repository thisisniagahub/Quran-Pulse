import React, { useState } from 'react';
import { TajweedSelector } from './TajweedSelector';
import { TajweedCoach } from './TajweedCoach';
import { PracticeMaterial } from '../types';
import { AGENT_DEFINITIONS } from '../lib/agents';
import type { Agent } from '../lib/agents';

type AgentId = 'gemini' | 'glm';

export const TajweedTutor: React.FC = () => {
    const [practiceMaterial, setPracticeMaterial] = useState<PracticeMaterial | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');

    const agentSet = AGENT_DEFINITIONS.tajweedFeedback;
    const activeAgent: Agent = agentSet[selectedAgentId];

    if (!practiceMaterial) {
        return <TajweedSelector 
                    onSelectMaterial={setPracticeMaterial} 
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={setSelectedAgentId}
                />;
    }

    return <TajweedCoach 
                practiceMaterial={practiceMaterial} 
                onBack={() => setPracticeMaterial(null)} 
                agent={activeAgent}
            />;
};