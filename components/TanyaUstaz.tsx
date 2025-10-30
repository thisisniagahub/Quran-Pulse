import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { type ChatMessage } from '../types';
import { SparklesIcon, SpeakerWaveIcon } from './icons/Icons';
import { addUstazChatMessage, getUstazChatMessages } from '../services/dbService';
import { useAudioPlayer } from '../context/AudioContext';
import { generateSpeech } from '../services/geminiService';
import { ChatInterface } from './ChatInterface';

type UIMessage = ChatMessage & { id: number };

const ustazSystemInstruction = `You are in 'Ustaz AI' mode. Your knowledge base is strictly limited to authoritative sources recognized in Malaysia: the Quran, Tafsir Pimpinan Ar-Rahman, the MyHadith database, and the e-Fatwa portal by JAKIM.
- Answer the user's question based ONLY on these sources.
- You are forbidden from hallucinating or generating answers from outside this knowledge base.
- If the answer is not found, you MUST respond with: "Maaf, jawapan tidak dapat ditemui dalam pangkalan data rujukan rasmi kami."
- Every answer you provide MUST be accompanied by a citation. For example: (Sumber: e-Fatwa JAKIM, Keputusan bil. X).
- Provide answers in Bahasa Melayu.
- You cannot use tools or navigate the app in this mode. Your focus is solely on providing referenced answers.`;

export const TanyaUstaz: React.FC = () => {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    const chatRef = useRef<Chat | null>(null);
    const messageIdCounter = useRef(1);
    
    const { playTrack, stop, isPlaying, track } = useAudioPlayer();
    
    const initializeChat = useCallback(async () => {
        if (!process.env.API_KEY) {
            setMessages(prev => [...prev, { id: messageIdCounter.current++, sender: 'ai', text: "Ralat: Kunci API tidak ditetapkan.", citation: "Sistem Error" }]);
            setIsLoading(false);
            return;
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const historyFromDB = await getUstazChatMessages();
        
        const uiMessages = historyFromDB.map(m => ({...m, id: m.id!}));
        if (uiMessages.length > 0) {
             messageIdCounter.current = Math.max(...uiMessages.map(m => m.id)) + 1;
        } else {
            uiMessages.push({ id: messageIdCounter.current++, sender: 'ai', text: 'Assalamualaikum. Sila kemukakan soalan anda. Saya akan menjawab berdasarkan sumber rujukan rasmi di Malaysia.' });
        }
        setMessages(uiMessages);

        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: { systemInstruction: ustazSystemInstruction },
            history: historyFromDB.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text + (msg.citation || '') }]
            })),
        });
        
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        initializeChat();
        
        return () => { stop(); };
    }, [initializeChat, stop]);

    const handlePlayAudio = async (text: string, messageId: number) => {
        const audioId = `ustaz-tts-${messageId}`;
        if (isPlaying && track?.title === audioId) {
            stop();
            return;
        }
        
        stop();
        const audioData = await generateSpeech(text);
        if (audioData) {
            playTrack({ src: audioData, title: audioId, type: 'wav_base64' });
        }
    };

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chatRef.current) return;
        
        const userMessageText = input;
        setInput('');

        const userMessage: Omit<UIMessage, 'id'> = { sender: 'user', text: userMessageText };
        const newId = messageIdCounter.current++;
        setMessages(prev => [...prev, { ...userMessage, id: newId }]);
        addUstazChatMessage(userMessage);
        
        setIsLoading(true);
        
        const aiMessageId = messageIdCounter.current++;
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userMessageText });
            let accumulatedText = '';
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if(chunkText) {
                    accumulatedText += chunkText;
                    setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: accumulatedText } : m));
                }
            }

            const citationMatch = accumulatedText.match(/\(Sumber: .*\)/);
            const citation = citationMatch ? citationMatch[0] : undefined;
            const text = accumulatedText.replace(citation || "", "").trim();

            setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text, citation } : m));
            addUstazChatMessage({ sender: 'ai', text, citation });
            
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg = { sender: 'ai' as const, text: "Maaf, berlaku ralat. Sila cuba lagi." };
            setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, ...errorMsg } : m));
            addUstazChatMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderMessageAddon = (msg: UIMessage) => {
        const isUser = msg.sender === 'user';
        const borderColor = isUser ? 'border-white/20' : 'border-border-light dark:border-border-dark';

        return (
            <>
                {msg.citation && (
                    <p className={`text-xs mt-3 pt-2 border-t ${borderColor} opacity-80`}>
                        {msg.citation}
                    </p>
                )}
                {msg.sender === 'ai' && msg.text && (
                    <button 
                        onClick={() => handlePlayAudio(msg.text, msg.id)}
                        className="mt-2 p-1.5 rounded-full hover:bg-foreground-light/10 dark:hover:bg-foreground-dark/10"
                        aria-label="Dengar jawapan"
                    >
                        <SpeakerWaveIcon className={`w-4 h-4 ${isPlaying && track?.title === `ustaz-tts-${msg.id}` ? 'text-primary' : ''}`} />
                    </button>
                )}
            </>
        );
    };

    return (
        <ChatInterface
            messages={messages}
            onSend={handleSend}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            inputPlaceholder="Tanya soalan feqah..."
            header={
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-primary mb-2">Tanya Ustaz</h2>
                    <p className="text-foreground-light/80 dark:text-foreground-dark/80">Dapatkan jawapan berpandukan sumber rasmi Malaysia.</p>
                    <div className="mt-4 text-center bg-primary/10 text-primary text-xs px-3 py-2 rounded-lg">
                        Sumber Rujukan: Al-Quran, Tafsir Pimpinan Ar-Rahman, MyHadith, e-Fatwa JAKIM.
                    </div>
                </div>
            }
            footer={
                <p className="text-xs text-center mt-2 text-foreground-light/60 dark:text-foreground-dark/60">Ustaz AI adalah alat bantuan dan bukan pengganti ulama bertauliah.</p>
            }
            renderMessageAddon={renderMessageAddon}
        />
    );
};
