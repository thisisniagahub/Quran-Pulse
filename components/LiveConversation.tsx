import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { ChatBubbleIcon, SparklesIcon, StopCircleIcon } from './icons/Icons';
// P2 REFACTOR: Import shared audio utilities instead of defining them locally.
import { encode, decode, decodeAudioData, createBlob } from '../utils/audio';


export const LiveConversation: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [transcripts, setTranscripts] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const transcriptsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcripts]);

    const cleanupAudio = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        audioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
        streamRef.current = null;
        audioContextRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        outputAudioContextRef.current = null;
    };

    const startSession = async () => {
        setStatus('connecting');
        setTranscripts([]);
        setError(null);

        try {
            if (!process.env.API_KEY) throw new Error("API Key not found");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const systemInstruction = `You are 'Sobat Suara', a friendly and knowledgeable Islamic AI assistant. Your goal is to have a natural, helpful voice conversation with the user in Bahasa Melayu. Answer their general Islamic questions, explain concepts simply, and maintain a warm, encouraging, and respectful tone. Avoid complex theological debates and stick to mainstream, widely accepted Islamic knowledge. If a question is too complex or sensitive, gently suggest the user consult a qualified human scholar.`;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: systemInstruction,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        const source = audioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current!.destination);
                        setStatus('listening');
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        handleServerMessage(message);
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error', e);
                        setError("Sesi terputus. Sila cuba lagi.");
                        setStatus('error');
                        cleanupAudio();
                    },
                    onclose: () => {
                        cleanupAudio();
                        setStatus('idle');
                    },
                }
            });

        } catch (error) {
            console.error("Failed to start session:", error);
            setError("Gagal memulakan sesi. Pastikan anda memberi kebenaran mikrofon.");
            setStatus('error');
        }
    };
    
    const handleServerMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription?.text) {
             setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === 'user') {
                    last.text += message.serverContent.inputTranscription.text;
                    return [...prev];
                }
                return [...prev, { sender: 'user', text: message.serverContent.inputTranscription.text }];
            });
        }
        if (message.serverContent?.outputTranscription?.text) {
            const textChunk = message.serverContent.outputTranscription.text;
            setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === 'ai') {
                    last.text += textChunk;
                    return [...prev];
                }
                return [...prev, { sender: 'ai', text: textChunk }];
            });
        }

        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
            setStatus('speaking');
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current!, 24000, 1);
            const source = outputAudioContextRef.current!.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContextRef.current!.destination);
            
            const currentTime = outputAudioContextRef.current!.currentTime;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);
            
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            
            audioSourcesRef.current.add(source);
            source.onended = () => {
                audioSourcesRef.current.delete(source);
                if (audioSourcesRef.current.size === 0) {
                     setStatus('listening');
                }
            };
        }
    };

    const stopSession = () => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
    };

    useEffect(() => {
        return () => {
             sessionPromiseRef.current?.then(session => session.close());
             cleanupAudio();
        };
    }, []);

    const getStatusText = () => {
        switch (status) {
            case 'idle': return 'Mula Sembang';
            case 'connecting': return 'Menyambung...';
            case 'listening': return 'Mendengar...';
            case 'speaking': return 'Sobat AI sedang bercakap...';
            case 'error': return 'Ralat';
            default: return 'Mula Sembang';
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-center h-full flex flex-col">
            <h2 className="text-3xl font-bold text-primary mb-2">Sembang Suara AI (PRO)</h2>
            <p className="text-foreground-light/80 dark:text-foreground-dark/80 mb-8">Berbual secara langsung dengan Sobat AI untuk sesi soal jawab interaktif.</p>
            
            <div className="flex-1 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4">
                    {transcripts.map((t, i) => (
                        <div key={i} className={`flex items-start gap-3 ${t.sender === 'user' ? 'justify-end' : ''}`}>
                            {t.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                            <div className={`p-3 rounded-lg max-w-md text-left ${t.sender === 'ai' ? 'bg-background-light dark:bg-background-dark' : 'bg-primary text-white'}`}>
                                <p>{t.text}</p>
                            </div>
                        </div>
                    ))}
                    {transcripts.length === 0 && status === 'idle' && (
                        <div className="flex flex-col items-center justify-center h-full text-foreground-light/60 dark:text-foreground-dark/60">
                            <ChatBubbleIcon className="w-16 h-16 mb-4"/>
                            <p>Tekan butang untuk memulakan perbualan.</p>
                        </div>
                    )}
                    <div ref={transcriptsEndRef} />
                </div>
                
                <div className="flex-shrink-0">
                    <button
                        onClick={status === 'idle' || status === 'error' ? startSession : stopSession}
                        disabled={status === 'connecting'}
                        className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 text-white
                            ${status !== 'idle' && status !== 'error' ? 'bg-primary hover:bg-primary/90 animate-pulse' : 'bg-accent hover:bg-accent/90'}
                            disabled:bg-foreground-light/50 disabled:cursor-not-allowed`}
                    >
                       {status !== 'idle' && status !== 'error' ? <StopCircleIcon className="w-10 h-10" /> : <ChatBubbleIcon className="w-10 h-10" />}
                    </button>
                    <p className="mt-4 font-semibold h-6">{getStatusText()}</p>
                    {error && <p className="text-sm text-primary mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};
