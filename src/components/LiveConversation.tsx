import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ChatBubbleIcon, StopCircleIcon } from './icons/Icons';
import { decode, decodeAudioData, createBlob } from '../utils/audio';
import { AgentSelector } from './ui/AgentSelector';
import { AGENT_DEFINITIONS } from '../lib/agents';
import type { Agent } from '../lib/agents';

type AgentId = 'gemini' | 'glm';

export const LiveConversation: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [transcripts, setTranscripts] = useState<{ sender: 'user' | 'ai', text: string }[]>([] );
    const [error, setError] = useState<string | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('gemini');

    const agentSet = AGENT_DEFINITIONS.liveConversation;
    const activeAgent: Agent = agentSet[selectedAgentId];

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const transcriptsEndRef = useRef<HTMLDivElement>(null);
    
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    useEffect(() => {
        transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcripts]);

    const cleanupAudio = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        audioContextRef.current?.close().catch(console.error);
        streamRef.current = null;
        audioContextRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
    };

    const startSession = async () => {
        setStatus('connecting');
        setTranscripts([]);
        setError(null);
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';

        try {
            // FIX: Use process.env.API_KEY as per guidelines. This fixes the TypeScript error
            // and aligns with project standards for API key management.
            const API_KEY = process.env.API_KEY;
            if (!API_KEY) {
                throw new Error("API Key not found. Please ensure the API_KEY environment variable is set.");
            }
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
            
            sessionPromiseRef.current = ai.live.connect({
                model: activeAgent.model,
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: activeAgent.systemInstruction,
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
                    onmessage: (message: LiveServerMessage) => {
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
                         if (status !== 'error') {
                           setStatus('idle');
                        }
                    },
                }
            });

        } catch (error) {
            console.error("Failed to start session:", error);
            setError("Gagal memulakan sesi. Pastikan anda memberi kebenaran mikrofon dan API Key ditetapkan.");
            setStatus('error');
            cleanupAudio();
        }
    };
    
    const handleServerMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription?.text) {
             currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
        }
        if (message.serverContent?.outputTranscription?.text) {
            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
        }

        if (message.serverContent?.turnComplete) {
            const finalInput = currentInputTranscriptionRef.current;
            const finalOutput = currentOutputTranscriptionRef.current;

            if (finalInput) {
                 setTranscripts(prev => [...prev, { sender: 'user', text: finalInput.trim() }]);
            }
            if (finalOutput) {
                 setTranscripts(prev => [...prev, { sender: 'ai', text: finalOutput.trim() }]);
            }
            currentInputTranscriptionRef.current = '';
            currentOutputTranscriptionRef.current = '';
        }

        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
            setStatus('speaking');
            const audioCtx = outputAudioContextRef.current;
            if (!audioCtx) return;

            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            
            const currentTime = audioCtx.currentTime;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);
            
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            
            audioSourcesRef.current.add(source);
            source.onended = () => {
                audioSourcesRef.current.delete(source);
                if (audioSourcesRef.current.size === 0 && status === 'speaking') {
                     setStatus('listening');
                }
            };
        }
    };

    const stopSession = () => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        cleanupAudio();
        setStatus('idle');
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
            case 'speaking': return `${activeAgent.name} sedang bercakap...`;
            case 'error': return 'Ralat';
            default: return 'Mula Sembang';
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-center h-full flex flex-col">
            <h2 className="text-3xl font-bold text-primary mb-2">Sembang Suara AI (PRO)</h2>
            <p className="text-foreground/80 mb-8">Berbual secara langsung dengan Sobat AI untuk sesi soal jawab interaktif.</p>
            
            <div className="flex-1 bg-card p-6 rounded-xl shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4">
                     {transcripts.length === 0 && (
                        <AgentSelector
                            agents={Object.values(agentSet)}
                            selectedAgentId={selectedAgentId}
                            onSelectAgent={(id) => { if(status === 'idle') setSelectedAgentId(id as AgentId)}}
                            title="Pilih Rakan Sembang"
                        />
                     )}
                    {transcripts.map((t, i) => (
                        <div key={i} className={`flex items-start gap-3 ${t.sender === 'user' ? 'justify-end' : ''}`}>
                            {t.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0">{activeAgent.icon}</div>}
                            <div className={`p-3 rounded-lg max-w-md text-left ${t.sender === 'ai' ? 'bg-background' : 'bg-primary text-white'}`}>
                                <p>{t.text}</p>
                            </div>
                        </div>
                    ))}
                    {transcripts.length === 0 && status === 'idle' && (
                        <div className="flex flex-col items-center justify-center h-full text-foreground/60">
                            <ChatBubbleIcon className="w-16 h-16 mb-4"/>
                            <p>Tekan butang di bawah untuk memulakan perbualan.</p>
                        </div>
                    )}
                    <div ref={transcriptsEndRef} />
                </div>
                
                <div className="flex-shrink-0">
                    <button
                        onClick={status === 'idle' || status === 'error' ? startSession : stopSession}
                        disabled={status === 'connecting'}
                        className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 text-white
                            ${status !== 'idle' && status !== 'error' ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}
                            disabled:bg-foreground/50 disabled:cursor-not-allowed`}
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

export default LiveConversation;