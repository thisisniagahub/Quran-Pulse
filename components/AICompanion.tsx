import React, { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { getChatMessages, addChatMessage } from '../services/dbService';
import type { ChatMessage, ActiveView } from '../types';
import { AGENT_DEFINITIONS } from '../lib/agents';
import { AgentSelector } from './ui/AgentSelector';
import type { Agent } from '../lib/agents';

type UIMessage = ChatMessage & { id: number };
type AgentId = 'gemini' | 'glm';

interface AICompanionProps {
  setActiveView: (view: ActiveView, params?: any) => void;
}

export const AICompanion: React.FC<AICompanionProps> = ({ setActiveView }) => {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');

    const agentSet = AGENT_DEFINITIONS.aiCompanion;
    const activeAgent: Agent = agentSet[selectedAgentId];

    useEffect(() => {
        const loadHistory = async () => {
            const history = await getChatMessages();
            const uiMessages = history.map((msg, index) => ({ ...msg, id: index + 1 }));
            if (uiMessages.length === 0) {
                 const welcomeMessage: ChatMessage = { sender: 'ai', text: "Assalamualaikum! Saya Sobat AI Cerdas anda. Apa yang boleh saya bantu hari ini?" };
                 setMessages([{...welcomeMessage, id: 1}]);
                 addChatMessage(welcomeMessage);
            } else {
                 setMessages(uiMessages);
            }
        };
        loadHistory();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, { ...userMessage, id: prev.length + 1 }]);
        setInput('');
        setIsLoading(true);

        try {
            await addChatMessage(userMessage);
            
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: input.trim(),
                    model: activeAgent.model,
                    systemInstruction: activeAgent.systemInstruction,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI.');
            }

            const data = await response.json();
            const aiMessage: ChatMessage = { sender: 'ai', text: data.text };
            
            setMessages(prev => [...prev, { ...aiMessage, id: prev.length + 1 }]);
            await addChatMessage(aiMessage);

        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { sender: 'ai', text: "Maaf, berlaku ralat. Sila cuba lagi." };
             setMessages(prev => [...prev, { ...errorMessage, id: prev.length + 1 }]);
            await addChatMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <ChatInterface
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            inputPlaceholder={`Berbual dengan ${activeAgent.name}...`}
            header={
                <AgentSelector 
                    agents={Object.values(agentSet)}
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={setSelectedAgentId}
                    title="Sobat AI Cerdas"
                />
            }
        />
    );
};

export default AICompanion;