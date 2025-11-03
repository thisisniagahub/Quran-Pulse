import React, { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { getUstazChatMessages, addUstazChatMessage } from '../services/dbService';
import type { ChatMessage } from '../types';
import { AGENT_DEFINITIONS } from '../lib/agents';
import { AgentSelector } from './ui/AgentSelector';
import type { Agent } from '../lib/agents';

type UIMessage = ChatMessage & { id: number };
type AgentId = 'gemini' | 'glm';

export const TanyaUstaz: React.FC = () => {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');

    const agentSet = AGENT_DEFINITIONS.tanyaUstaz;
    const activeAgent: Agent = agentSet[selectedAgentId];

    useEffect(() => {
        const loadHistory = async () => {
            const history = await getUstazChatMessages();
            // Assign a temporary, sequential ID for UI keys
            setMessages(history.map((msg, index) => ({ ...msg, id: index + 1 })));
        };
        loadHistory();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input.trim() };
        const newMessages = [...messages, { ...userMessage, id: messages.length + 1 }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            await addUstazChatMessage(userMessage);

            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: input.trim(),
                    model: activeAgent.model,
                    systemInstruction: activeAgent.systemInstruction
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI.');
            }

            const data = await response.json();
            const aiMessage: ChatMessage = { sender: 'ai', text: data.text };
            
            setMessages(prev => [...prev, { ...aiMessage, id: prev.length + 1 }]);
            await addUstazChatMessage(aiMessage);

        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { sender: 'ai', text: "Maaf, berlaku ralat. Sila cuba lagi." };
            setMessages(prev => [...prev, { ...errorMessage, id: prev.length + 1 }]);
            await addUstazChatMessage(errorMessage);
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
            inputPlaceholder={`Tanya soalan kepada ${activeAgent.name}...`}
            header={
                <AgentSelector
                    agents={Object.values(agentSet)}
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={setSelectedAgentId}
                    title="Tanya Ustaz (AI)"
                />
            }
        />
    );
};