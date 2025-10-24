
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, Modality, FunctionCall } from '@google/genai';
import { ActiveView, type ChatMessage } from '../types';
import { SparklesIcon, SendIcon, BookOpenIcon, ClockIcon, PhotoIcon, CompassIcon, CheckSquareIcon, ListIcon, PencilIcon, MicrophoneIcon, CalendarIcon } from './icons/Icons';
import { addChatMessage, getChatMessages } from '../services/dbService';

// --- Type Definitions ---
type AIMode = 'sobat' | 'ustaz';
type UIMessage = ChatMessage & { id: number };


// --- System Prompts and Tool Declarations ---

const sobatSystemInstruction = `You are 'Sobat AI Cerdas', a sophisticated and helpful AI companion integrated within the QuranPulse application. Your primary role is to act as an intelligent agent that assists users by providing information and performing actions within the app.

**Your Capabilities:**
1.  **App Knowledge:** You have complete knowledge of the QuranPulse app's features: Al-Quran Reader, Prayer Times, Qibla Compass, Ibadah Tracker, Doa & Zikr, Jawi Writer, Tajweed Tutor, Study Planner, and yourself.
2.  **Action Agent:** You can help users navigate the app. When a user's request maps to an app feature, you MUST use the provided tools to suggest a navigation action.
    *   Example 1: User asks "Boleh tunjukkan saya waktu solat untuk hari ini?", you call \`navigateToView({ viewName: 'prayer-times' })\`.
    *   Example 2: User says "Saya nak baca surah Al-Mulk", you must call \`navigateToSurah({ surahNumber: 67 })\`.
    *   Example 3: User requests "Tunjukkan progress Ibadah Tracker saya", you call \`navigateToView({ viewName: 'ibadah-tracker' })\`.
    *   Example 4: User asks "Mainkan Surah Yasin", you must call \`navigateToSurah({ surahNumber: 36, autoplay: true })\`.
    *   Example 5: User says "Saya nak berlatih mengaji dengan tutor AI", you call \`navigateToView({ viewName: 'tajweed-coach' })\`.
    *   After calling a tool, present your response conversationally and let the user confirm the action.
3.  **Image Generation:** If a user's request can be better explained with a visual aid like a diagram (e.g., 'terangkan proses wuduk'), a chart (e.g., 'tunjukkan perbandingan rukun iman dan islam'), or a conceptual image (e.g., 'gambarkan suasana di padang mahsyar'), you MUST first provide a textual explanation, and then call the \`generateImage({ prompt: "..." })\` tool to create a relevant image. The prompt for the image should be a concise, descriptive instruction in English.
4.  **Islamic Knowledge:** You can answer general questions about Islam in a friendly, accessible manner in Bahasa Melayu.
5.  **Persona Switching:** If the user asks a formal religious question or specifically requests 'Ustaz AI', inform them you will switch to Ustaz AI mode for a more formal answer based on official sources.

**Interaction Rules:**
*   Always be friendly, helpful, and encouraging.
*   Prioritize using your action tools and image generation to help the user.
*   Converse in Bahasa Melayu.`;
    
const ustazSystemInstruction = `You are in 'Ustaz AI' mode. Your knowledge base is strictly limited to authoritative sources recognized in Malaysia: the Quran, Tafsir Pimpinan Ar-Rahman, the MyHadith database, and the e-Fatwa portal by JAKIM.
- Answer the user's question based ONLY on these sources.
- You are forbidden from hallucinating or generating answers from outside this knowledge base.
- If the answer is not found, you MUST respond with: "Maaf, jawapan tidak dapat ditemui dalam pangkalan data rujukan rasmi kami."
- Every answer you provide MUST be accompanied by a citation. For example: (Sumber: e-Fatwa JAKIM, Keputusan bil. X).
- Provide answers in Bahasa Melayu.
- You cannot use tools or navigate the app in this mode. Your focus is solely on providing referenced answers.`;

const navigateToSurahTool: FunctionDeclaration = {
    name: 'navigateToSurah',
    parameters: {
        type: Type.OBJECT,
        description: 'Navigates the user to a specific surah (chapter) and optionally an ayah (verse) in the Quran reader. Can also start audio playback automatically.',
        properties: {
            surahNumber: { type: Type.NUMBER, description: 'The surah number to navigate to (1-114).' },
            ayahNumber: { type: Type.NUMBER, description: 'Optional. The specific ayah number to scroll to.' },
            autoplay: { type: Type.BOOLEAN, description: 'Optional. If true, start playing the surah audio automatically.' },
        },
        required: ['surahNumber'],
    },
};

const navigateToViewTool: FunctionDeclaration = {
    name: 'navigateToView',
    parameters: {
        type: Type.OBJECT,
        description: 'Navigates the user to a specific feature or view within the app.',
        properties: {
            viewName: {
                type: Type.STRING,
                description: 'The name of the view to navigate to. Supported values: "quran-reader", "prayer-times", "qibla", "ibadah-tracker", "doa-zikr", "jawi-writer", "tajweed-coach", "study-planner".'
            },
        },
        required: ['viewName'],
    },
};

const generateImageTool: FunctionDeclaration = {
    name: 'generateImage',
    parameters: {
        type: Type.OBJECT,
        description: 'Generates an image, diagram, or chart based on a descriptive prompt to visually aid the user\'s understanding.',
        properties: {
            prompt: {
                type: Type.STRING,
                description: 'A clear, descriptive prompt in English for the image to be generated. E.g., "A diagram showing the steps of wudu with labels", "A simple chart comparing the pillars of Iman and Islam".'
            },
        },
        required: ['prompt'],
    },
};


interface AICompanionProps {
  onNavigate: (view: ActiveView, params?: { [key: string]: any }) => void;
}

export const AICompanion: React.FC<AICompanionProps> = ({ onNavigate }) => {
    const [mode, setMode] = useState<AIMode>('sobat');
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [generatingImageForId, setGeneratingImageForId] = useState<number | null>(null);
    
    const chatRef = useRef<Chat | null>(null);
    const messageIdCounter = useRef(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, generatingImageForId]);

    const initializeChat = useCallback(async () => {
        if (!process.env.API_KEY) {
            setMessages(prev => [...prev, { id: messageIdCounter.current++, sender: 'ai', text: "Ralat: Kunci API tidak ditetapkan.", citation: "Sistem Error" }]);
            setIsLoading(false);
            return;
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = mode === 'sobat' ? sobatSystemInstruction : ustazSystemInstruction;
        const tools = mode === 'sobat' ? [{ functionDeclarations: [navigateToSurahTool, navigateToViewTool, generateImageTool] }] : undefined;
        
        const historyFromDB = await getChatMessages();
        
        // Map DB messages to UIMessages and find the max ID
        const uiMessages = historyFromDB.map(m => ({...m, id: m.id!}));
        if (uiMessages.length > 0) {
             messageIdCounter.current = Math.max(...uiMessages.map(m => m.id)) + 1;
        } else {
            uiMessages.push({ id: messageIdCounter.current++, sender: 'ai', text: 'Assalamualaikum! Saya Sobat AI, teman AI Islamik anda. Apa yang boleh saya bantu hari ini? Anda juga boleh bertanya kepada "Ustaz AI" untuk soalan formal.' });
        }
        setMessages(uiMessages);

        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: { systemInstruction, tools },
            history: historyFromDB.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
        });
        
        setIsLoading(false);
    }, [mode]);

    useEffect(() => {
        setIsLoading(true);
        initializeChat();
    }, [mode]); // Re-initialize when mode changes
    
    const switchMode = (newMode: AIMode) => {
        if (mode === newMode) return;
        setMode(newMode); // This will trigger the useEffect to re-initialize the chat
        const modeMessage = newMode === 'ustaz' 
            ? 'Mod Ustaz AI diaktifkan. Jawapan akan berdasarkan sumber rasmi sahaja.'
            : 'Mod Sobat AI diaktifkan. Saya sedia membantu anda meneroka aplikasi.';
        const systemMsg = {sender: 'ai' as const, text: modeMessage, citation: "System"};
        setMessages(prev => [...prev, {...systemMsg, id: messageIdCounter.current++}]);
        addChatMessage(systemMsg);
    };

    const handleGenerateImage = async (prompt: string, messageId: number) => {
        if (!process.env.API_KEY) return;
        setGeneratingImageForId(messageId);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, imageUrl } : m));
                    // TODO: Save image URL to DB. Requires schema change. For now, it's ephemeral.
                    break; 
                }
            }

        } catch (error) {
            console.error("Error generating image:", error);
            // Optionally add an error message to the chat
        } finally {
            setGeneratingImageForId(null);
        }
    }

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chatRef.current) return;
        
        const userMessageText = input;
        setInput('');
        
        // Auto-detect mode switch
        if (userMessageText.toLowerCase().includes('ustaz ai') && mode !== 'ustaz') {
            switchMode('ustaz');
            return; // Mode switch will re-init, so we stop here
        } else if (userMessageText.toLowerCase().includes('sobat ai') && mode !== 'sobat') {
            switchMode('sobat');
            return; // Mode switch will re-init
        }

        const userMessage: Omit<UIMessage, 'id'> = { sender: 'user', text: userMessageText };
        const newId = messageIdCounter.current++;
        setMessages(prev => [...prev, { ...userMessage, id: newId }]);
        addChatMessage(userMessage);
        
        setIsLoading(true);
        
        const aiMessageId = messageIdCounter.current++;
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userMessageText });
            let accumulatedText = '';
            let functionCalls: FunctionCall[] = [];
            
            for await (const chunk of stream) {
                if(chunk.functionCalls && chunk.functionCalls.length > 0) {
                    functionCalls.push(...chunk.functionCalls);
                }
                const chunkText = chunk.text;
                if(chunkText) {
                    accumulatedText += chunkText;
                    setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: accumulatedText } : m));
                }
            }

            let finalAction: ChatMessage['action'] | undefined;
            
            if (functionCalls.length > 0) {
                for (const fc of functionCalls) {
                    if (!fc.name) continue;

                     if (fc.name === 'generateImage' && fc.args?.prompt) {
                        handleGenerateImage(fc.args.prompt as string, aiMessageId);
                    } else {
                        if (fc.name === 'navigateToSurah' && fc.args) {
                            finalAction = {
                                label: fc.args.autoplay ? `Mainkan Surah ${fc.args.surahNumber}` : `Buka Surah ${fc.args.surahNumber}`,
                                view: ActiveView.QURAN_READER,
                                params: { 
                                    surahNumber: fc.args.surahNumber, 
                                    ayahNumber: fc.args.ayahNumber,
                                    autoplay: fc.args.autoplay || false
                                }
                            };
                        } else if (fc.name === 'navigateToView' && fc.args) {
                            finalAction = {
                                label: `Buka ${(fc.args.viewName as string).replace('-', ' ')}`,
                                view: fc.args.viewName as ActiveView,
                            };
                        }
                        if (finalAction) {
                            setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, action: finalAction } : m));
                        }
                    }
                }
            }
            addChatMessage({ sender: 'ai', text: accumulatedText, action: finalAction });
            
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg = { sender: 'ai' as const, text: "Maaf, berlaku ralat. Sila cuba lagi." };
            setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, ...errorMsg } : m));
            addChatMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    
     const renderActionButton = (msg: UIMessage) => {
        if (!msg.action) return null;

        const getIconForView = (view: ActiveView) => {
            switch (view) {
                case ActiveView.QURAN_READER: return BookOpenIcon;
                case ActiveView.PRAYER_TIMES: return ClockIcon;
                case ActiveView.QIBLA: return CompassIcon;
                case ActiveView.IBADAH_TRACKER: return CheckSquareIcon;
                case ActiveView.DOA_ZIKR: return ListIcon;
                case ActiveView.JAWI_WRITER: return PencilIcon;
                case ActiveView.TAJWEED_COACH: return MicrophoneIcon;
                case ActiveView.STUDY_PLANNER: return CalendarIcon;
                default: return SparklesIcon;
            }
        };

        const Icon = getIconForView(msg.action.view);

        return (
            <button
                onClick={() => onNavigate(msg.action!.view, msg.action!.params)}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
            >
                <Icon className="w-4 h-4" />
                {msg.action.label}
            </button>
        );
    };

    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-primary"/>
                    <h2 className="text-xl font-bold">Sobat AI Cerdas</h2>
                </div>
                <div className="flex gap-1 p-1 bg-background-light dark:bg-background-dark rounded-lg">
                    <button onClick={() => switchMode('sobat')} className={`px-3 py-1 text-sm rounded-md ${mode === 'sobat' ? 'bg-card-light dark:bg-card-dark shadow-sm' : ''}`}>Sobat AI</button>
                    <button onClick={() => switchMode('ustaz')} className={`px-3 py-1 text-sm rounded-md ${mode === 'ustaz' ? 'bg-card-light dark:bg-card-dark shadow-sm' : ''}`}>Ustaz AI</button>
                </div>
            </div>
            
            {/* Chat Area */}
             <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                        <div className={`p-4 rounded-xl max-w-lg ${msg.sender === 'ai' ? 'bg-background-light dark:bg-background-dark' : 'bg-primary text-white'}`}>
                            <p className="whitespace-pre-wrap">{msg.text || (isLoading && messages[messages.length-1].id === msg.id ? '...' : '')}</p>
                            {msg.citation && <p className="text-xs mt-3 pt-2 border-t border-white/20 opacity-70">{msg.citation}</p>}
                            {generatingImageForId === msg.id && (
                                <div className="mt-3 p-4 bg-foreground-light/5 dark:bg-foreground-dark/5 rounded-lg animate-pulse">
                                    <div className="flex items-center gap-2 text-sm text-foreground-light/70 dark:text-foreground-dark/70">
                                        <PhotoIcon className="w-5 h-5"/>
                                        <span>Menjana imej...</span>
                                    </div>
                                </div>
                            )}
                            {msg.imageUrl && (
                                <div className="mt-3">
                                    <img src={msg.imageUrl} alt="Generated by AI" className="rounded-lg max-w-full h-auto" />
                                </div>
                            )}
                            {renderActionButton(msg)}
                        </div>
                    </div>
                ))}
                {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
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
            
            {/* Input Bar */}
            <div className="mt-6">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={mode === 'sobat' ? "Tanya apa saja atau beri arahan..." : "Tanya soalan feqah..."}
                        className="w-full pl-4 pr-12 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={isLoading || !!generatingImageForId}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === '' || !!generatingImageForId} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white disabled:bg-foreground-light/20 dark:disabled:bg-foreground-dark/20 transition-colors">
                        <SendIcon />
                    </button>
                </div>
                 <p className="text-xs text-center mt-2 text-foreground-light/60 dark:text-foreground-dark/60">Sobat AI boleh membuat kesilapan. Pertimbangkan untuk menyemak maklumat penting.</p>
            </div>
        </div>
    );
};
