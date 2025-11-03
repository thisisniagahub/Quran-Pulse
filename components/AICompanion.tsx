import React, { useState, useEffect, useCallback } from 'react';
import { ChatInterface } from './ChatInterface';
import { getChatMessages, addChatMessage } from '../services/dbService';
import type { ChatMessage, ActiveView } from '../types';
import { AGENT_DEFINITIONS } from '../lib/agents';
import { AgentSelector } from './ui/AgentSelector';
import type { Agent } from '../lib/agents';
import { debounce } from '../utils/debounce';

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

    // Debounced version of handleSend to prevent multiple rapid calls
    const debouncedHandleSend = useCallback(debounce(async (inputText: string) => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: inputText.trim() };
        setMessages(prev => [...prev, { ...userMessage, id: prev.length + 1 }]);
        
        setIsLoading(true);

        try {
            await addChatMessage(userMessage);
            
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: inputText.trim(),
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
    }, 300), [isLoading, activeAgent]);

    const handleSend = useCallback(() => {
        debouncedHandleSend(input);
        setInput(''); // Clear input immediately
    }, [input, debouncedHandleSend]);

    // Also debounce input changes for real-time suggestions if needed
    const [debouncedInput, setDebouncedInput] = useState(input);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(input);
        }, 500); // Update debounced input after 500ms of no typing

        return () => {
            clearTimeout(handler);
        };
    }, [input]);
    
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