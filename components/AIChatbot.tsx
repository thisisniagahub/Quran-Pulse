import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { generateSpeech } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { ChatBubbleIcon, SendIcon, SpeakerWaveIcon, StopIcon } from './icons/Icons';
import { useAudioPlayer } from '../context/AudioContext';

interface UIMessage extends ChatMessage {
    id: number;
    audioState: 'idle' | 'loading' | 'error';
    audioData?: string;
}

export const AIChatbot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const messageIdCounter = useRef(2);
    const [messages, setMessages] = useState<UIMessage[]>([
        { id: 1, sender: 'ai', text: 'Assalamualaikum! Saya Sobat AI, teman AI Islamik anda. Apa yang boleh saya bantu hari ini?', audioState: 'idle' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { track, isPlaying, playTrack, togglePlayPause } = useAudioPlayer();

    useEffect(() => {
        const initializeChat = () => {
             if (!process.env.API_KEY) {
                console.error("API_KEY not found");
                setMessages(prev => [...prev, { id: messageIdCounter.current++, sender: 'ai', text: "Ralat: Kunci API tidak ditetapkan. Sila semak konfigurasi aplikasi.", audioState: 'error'}]);
                return;
             }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash-lite',
                config: {
                    systemInstruction: "You are 'Sobat AI', a friendly and knowledgeable Islamic AI companion from QuranPulse. Your purpose is to answer questions about Islam, provide daily inspiration, and discuss Islamic topics in an accessible way for a general audience in Malaysia. Answer in Bahasa Melayu. Be encouraging and positive.",
                },
            });
            setChat(chatSession);
        };
        initializeChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const updateMessage = useCallback((id: number, updates: Partial<UIMessage>) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    }, []);

    const handlePlayAudio = async (message: UIMessage) => {
        const trackId = `tts-sobat-${message.id}`;

        if (track?.title === trackId) {
            togglePlayPause();
            return;
        }

        let audioData = message.audioData;

        if (!audioData) {
            updateMessage(message.id, { audioState: 'loading' });
            try {
                const base64Audio = await generateSpeech(message.text);
                if (!base64Audio) throw new Error("Audio generation failed");
                audioData = base64Audio;
                updateMessage(message.id, { audioData, audioState: 'idle' });
            } catch (e) {
                console.error(e);
                updateMessage(message.id, { audioState: 'error' });
                return;
            }
        }
        
        if (audioData) {
            playTrack({
                src: audioData,
                title: trackId,
                type: 'wav_base64'
            });
        }
    };


    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chat) return;

        const userMessage: UIMessage = { id: messageIdCounter.current++, sender: 'user', text: input, audioState: 'idle' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiMessageId = messageIdCounter.current++;
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '', audioState: 'idle' }]);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let accumulatedText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                accumulatedText += chunkText;
                setMessages(prev => prev.map(m => 
                    m.id === aiMessageId ? { ...m, text: accumulatedText } : m
                ));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            updateMessage(aiMessageId, { text: "Maaf, berlaku ralat. Sila cuba lagi.", audioState: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderAudioButton = (msg: UIMessage) => {
        if (msg.sender !== 'ai' || !msg.text.trim() || msg.audioState === 'error') return null;

        const trackId = `tts-sobat-${msg.id}`;
        const isCurrentTrack = track?.title === trackId;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;

        let icon;

        if (msg.audioState === 'loading') {
            icon = <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>;
        } else if (isCurrentlyPlaying) {
            icon = <StopIcon className="w-5 h-5" />;
        } else {
            icon = <SpeakerWaveIcon className="w-5 h-5" />;
        }

        return (
            <button
                onClick={() => handlePlayAudio(msg)}
                disabled={msg.audioState === 'loading'}
                className="p-2 rounded-full text-foreground-light/70 dark:text-foreground-dark/70 hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isCurrentlyPlaying ? "Hentikan audio" : "Mainkan audio"}
            >
                {icon}
            </button>
        );
    };

    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col">
             <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start"><ChatBubbleIcon className="w-5 h-5"/></div>}
                        <div className={`flex items-end gap-2 max-w-xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`p-4 rounded-xl ${msg.sender === 'ai' ? 'bg-background-light dark:bg-background-dark' : 'bg-primary text-white'}`}>
                                <p className="whitespace-pre-wrap">{msg.text || '...'}</p>
                            </div>
                           {renderAudioButton(msg)}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-6">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Mesej Sobat AI..."
                        className="w-full pl-4 pr-12 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading || !chat}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === '' || !chat} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white disabled:bg-foreground-light/20 dark:disabled:bg-foreground-dark/20 transition-colors">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};