import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SparklesIcon, SendIcon, SpeakerWaveIcon, StopIcon } from './icons/Icons';
import { askUstaz, generateSpeech } from '../services/geminiService';
import { useAudioPlayer } from '../context/AudioContext';

interface UIMessage extends ChatMessage {
    id: number;
    audioState: 'idle' | 'loading' | 'error';
    audioData?: string;
}

export const TanyaUstaz: React.FC = () => {
    const messageIdCounter = useRef(2);
    const [messages, setMessages] = useState<UIMessage[]>([
        { id: 1, sender: 'ai', text: 'Assalamualaikum, saya Ustaz AI. Sila ajukan soalan anda berkaitan Islam berdasarkan sumber yang sahih.', citation: "Sistem AI QuranPulse", audioState: 'idle' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const { track, isPlaying, playTrack, togglePlayPause } = useAudioPlayer();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const updateMessage = (id: number, updates: Partial<UIMessage>) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handlePlayAudio = async (message: UIMessage) => {
        const trackId = `tts-ustaz-${message.id}`;

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
        if (input.trim() === '' || isLoading) return;

        const userMessage: UIMessage = { id: messageIdCounter.current++, sender: 'user', text: input, audioState: 'idle' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponse = await askUstaz(input);
        
        const aiMessage: UIMessage = {
            id: messageIdCounter.current++,
            sender: 'ai',
            text: aiResponse.text,
            citation: aiResponse.citation,
            audioState: 'idle',
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    const renderAudioButton = (msg: UIMessage) => {
        if (msg.sender !== 'ai' || !msg.text.trim() || msg.audioState === 'error' || msg.text.startsWith("Maaf,")) return null;

        const trackId = `tts-ustaz-${msg.id}`;
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
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start"><SparklesIcon className="w-5 h-5"/></div>}
                        <div className={`flex items-end gap-2 max-w-xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`p-4 rounded-xl ${msg.sender === 'ai' ? 'bg-background-light dark:bg-background-dark' : 'bg-primary text-white'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.citation && <p className="text-xs mt-3 pt-2 border-t border-white/10 opacity-70">{msg.citation}</p>}
                            </div>
                            {renderAudioButton(msg)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><SparklesIcon className="w-5 h-5"/></div>
                        <div className="p-4 rounded-xl max-w-lg bg-background-light dark:bg-background-dark">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-6">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Tanya soalan anda di sini..."
                        className="w-full pl-4 pr-12 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white disabled:bg-foreground-light/20 dark:disabled:bg-foreground-dark/20 transition-colors">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};