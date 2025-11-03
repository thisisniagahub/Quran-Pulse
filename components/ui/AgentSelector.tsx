import React from 'react';
import { cn } from '../../lib/utils';
import type { Agent } from '../../lib/agents';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId: 'gemini' | 'glm';
  onSelectAgent: (agentId: 'gemini' | 'glm') => void;
  title?: string;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, selectedAgentId, onSelectAgent, title = "Pilih Ejen AI" }) => {
  return (
    <div className="p-4 text-center border-b border-border-light dark:border-border-dark">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-foreground-light/70">Pilih model AI untuk membantu anda.</p>
      <div className="mt-4 flex justify-center gap-2 p-1 bg-background-light dark:bg-background-dark rounded-lg">
        {agents.map(agent => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-semibold transition-colors",
              selectedAgentId === agent.id ? "bg-primary text-white" : "hover:bg-primary/10"
            )}
            title={agent.description}
          >
            {agent.icon}
            {agent.name}
          </button>
        ))}
      </div>
    </div>
  );
};