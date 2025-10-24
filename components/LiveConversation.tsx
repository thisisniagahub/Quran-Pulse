import React, { useState, useRef, useEffect } from 'react';
// FIX: Removed non-exported 'LiveSession' type.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicrophoneIcon, StopCircleIcon, SparklesIcon } from './icons/Icons';

// Audio Encoding/Decoding Helpers
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}


export const LiveConversation: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [transcripts, setTranscripts] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
    const transcriptsEndRef = useRef<HTMLDivElement>(null);
    
    // FIX: 'LiveSession' is not exported, using 'any' for the session type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    useEffect(() => {
        transcriptsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcripts]);

    const cleanupAudio = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
        }
        streamRef.current = null;
        audioContextRef.current = null;
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        outputAudioContextRef.current = null;
        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
    };

    const startSession = async () => {
        setStatus('connecting');
        setTranscripts([]);

        try {
            if (!process.env.API_KEY) throw new Error("API Key not found");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: "You are a friendly and helpful AI assistant named Sobat Suara from QuranPulse. Engage in a natural, supportive conversation with the user in Bahasa Melayu. Keep your responses conversational and not too long.",
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
                        setTranscripts([{sender: 'ai', text: 'Assalamualaikum! Saya Sobat Suara. Apa yang boleh saya bantu?'}]);
                    },
                    onmessage: (message: LiveServerMessage) => {
                        handleServerMessage(message);
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error', e);
                        setStatus('error');
                        cleanupAudio();
                    },
                    onclose: () => {
                        console.log('Session closed');
                        cleanupAudio();
                        setStatus('idle');
                    },
                }
            });

        } catch (error) {
            console.error("Failed to start session:", error);
            setStatus('error');
        }
    };
    
    const handleServerMessage = async (message: LiveServerMessage) => {
        let isSpeaking = false;
        
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
            isSpeaking = true;
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

        if (message.serverContent?.inputTranscription?.text) {
             setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === 'user') {
                    // It's possible for the transcription to come in chunks
                    const newText = last.text + message.serverContent.inputTranscription.text;
                    return [...prev.slice(0, -1), { ...last, text: newText }];
                }
                // New user turn
                return [...prev, { sender: 'user', text: message.serverContent.inputTranscription.text }];
            });
        }
        if (message.serverContent?.outputTranscription?.text) {
            setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === 'ai') {
                    const newText = last.text + message.serverContent.outputTranscription.text;
                    return [...prev.slice(0, -1), { ...last, text: newText }];
                }
                // New AI turn
                return [...prev, { sender: 'ai', text: message.serverContent.outputTranscription.text }];
            });
        }
        
        const interrupted = message.serverContent?.interrupted;
        if (interrupted) {
            for (const source of audioSourcesRef.current.values()) {
                source.stop();
                audioSourcesRef.current.delete(source);
            }
            nextStartTimeRef.current = 0;
            if (!isSpeaking) {
                setStatus('listening');
            }
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
            case 'idle': return 'Tekan untuk mula berbual';
            case 'connecting': return 'Menyambung...';
            case 'listening': return 'Mendengar...';
            case 'speaking': return 'AI sedang bercakap...';
            case 'error': return 'Ralat berlaku. Sila cuba lagi.';
            default: return 'Tekan untuk mula berbual';
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Sembang Suara AI</h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Berbual secara langsung dengan pembantu AI anda.</p>
            </div>
            
            <div className="flex-1 bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl shadow-sm overflow-y-auto mb-6">
                 <div className="space-y-4">
                    {transcripts.map((t, i) => (
                         <div key={i} className={`flex items-start gap-3 ${t.sender === 'user' ? 'justify-end' : ''}`}>
                            {t.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary self-start shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                            <div className={`p-3 rounded-lg max-w-md ${t.sender === 'ai' ? 'bg-background-light dark:bg-background-dark' : 'bg-primary text-white'}`}>
                                <p>{t.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={transcriptsEndRef} />
                </div>
            </div>

            <div className="text-center">
                 <button
                    onClick={status === 'idle' || status === 'error' ? startSession : stopSession}
                    disabled={status === 'connecting'}
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all duration-300 text-white ${
                        status !== 'idle' && status !== 'error' ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'
                    } disabled:bg-foreground-light/20 dark:disabled:bg-foreground-dark/20 disabled:cursor-not-allowed`}
                    aria-label={status === 'idle' || status === 'error' ? 'Start session' : 'Stop session'}
                >
                   {status !== 'idle' && status !== 'error' ? <StopCircleIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-10 h-10" />}
                </button>
                <p className="mt-4 font-semibold h-6">{getStatusText()}</p>
            </div>
        </div>
    );
};