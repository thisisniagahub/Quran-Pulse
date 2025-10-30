import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import type { PracticeMaterial, TajweedSession } from '../types';
import { addTajweedSession } from '../services/dbService';
import { createBlob } from '../utils/audio';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { ChevronLeftIcon, MicrophoneIcon, StopCircleIcon, SparklesIcon, SpeakerWaveIcon } from './icons/Icons';
import { useAudioPlayer } from '../context/AudioContext';

interface TajweedCoachProps {
    practiceMaterial: PracticeMaterial;
    onBack: () => void;
}

export const TajweedCoach: React.FC<TajweedCoachProps> = ({ practiceMaterial, onBack }) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'analyzing' | 'speaking' | 'error'>('idle');
    const [userTranscript, setUserTranscript] = useState('');
    const [aiFeedback, setAiFeedback] = useState('');
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
    const { playTrack, stop: stopPlayback, isPlaying, track } = useAudioPlayer();
    const feedbackAudioRef = useRef<string | null>(null);

    const cleanupAudio = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
             audioContextRef.current.close().catch(console.error);
             audioContextRef.current = null;
        }
        streamRef.current = null;
    };

    useEffect(() => {
        return () => {
            sessionPromiseRef.current?.then(session => session.close());
            cleanupAudio();
            stopPlayback();
        };
    }, [stopPlayback]);

    const handleServerMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription?.text) {
            setUserTranscript(prev => prev + message.serverContent.inputTranscription.text);
        }
        if (message.serverContent?.outputTranscription?.text) {
            setStatus('speaking');
            setAiFeedback(prev => prev + message.serverContent.outputTranscription.text);
        }

        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
            feedbackAudioRef.current = base64Audio;
            playTrack({ src: base64Audio, title: 'ai-feedback', type: 'wav_base64' });
        }

        if (message.serverContent?.turnComplete) {
            setStatus('idle');
            // Use local variables to avoid state update delays in closure
            const finalUserTranscript = userTranscript + (message.serverContent?.inputTranscription?.text || '');
            const finalAiFeedback = aiFeedback + (message.serverContent?.outputTranscription?.text || '');

            if (finalUserTranscript && finalAiFeedback) {
                const sessionData: Omit<TajweedSession, 'id' | 'timestamp'> = {
                    material: practiceMaterial,
                    transcripts: [
                        { sender: 'user', text: finalUserTranscript },
                        { sender: 'ai', text: finalAiFeedback },
                    ],
                };
                addTajweedSession(sessionData).catch(console.error);
            }
        }
    };

    const startSession = async () => {
        if (status !== 'idle' && status !== 'error') return;
        setStatus('connecting');
        setUserTranscript('');
        setAiFeedback('');
        setError(null);
        feedbackAudioRef.current = null;

        const systemInstruction = `You are an expert AI Tajweed Tutor. The user will recite the following text:\n---\n${practiceMaterial.content}\n---\nYour task is to listen and provide constructive feedback in Bahasa Melayu.\n1. Listen carefully to the user's recitation.\n2. Identify specific mistakes in Makhraj, Sifat, Mad, Ghunnah, etc.\n3. Provide encouraging, clear, and concise feedback verbally. Focus on 1-2 key areas for improvement.\n4. Example: "MasyaAllah, bacaan anda sudah baik. Sedikit catatan pada kalimah 'qul'. Pastikan lantunan Qalqalah pada huruf 'Qaf' (ق) lebih jelas. Cuba sebut sekali lagi."\n5. Wait for the user to start speaking. Do not speak first.`;

        try {
            if (!process.env.API_KEY) throw new Error("API Key not found");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
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
                    },
                    onmessage: handleServerMessage,
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error', e);
                        setError("Sesi terputus. Sila cuba lagi.");
                        setStatus('error');
                        cleanupAudio();
                    },
                    onclose: () => {
                        setStatus('idle');
                        cleanupAudio();
                    },
                }
            });
        } catch (err) {
            console.error("Failed to start session:", err);
            setError("Gagal memulakan sesi. Pastikan anda memberi kebenaran mikrofon.");
            setStatus('error');
        }
    };

    const stopSession = () => {
        if (status === 'listening') {
            setStatus('analyzing');
        }
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        cleanupAudio();
    };

    const getStatusText = () => {
        switch(status) {
            case 'idle': return 'Tekan untuk mula berlatih';
            case 'connecting': return 'Menyambung ke Tutor AI...';
            case 'listening': return 'Mendengar... Sila baca teks di bawah.';
            case 'analyzing': return 'Menganalisa bacaan anda...';
            case 'speaking': return 'Sobat AI sedang memberi maklum balas...';
            case 'error': return 'Ralat berlaku.';
            default: return '';
        }
    };
    
    return (
        <div>
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Pilih Bahan Lain
            </Button>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-primary">{practiceMaterial.title}</h2>
                    <div dir="rtl" className="font-arabic text-3xl text-right leading-loose space-y-2 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                        {practiceMaterial.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <button
                    onClick={status === 'listening' ? stopSession : startSession}
                    disabled={status === 'connecting' || status === 'analyzing' || status === 'speaking'}
                    className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 text-white
                        ${status === 'listening' ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}
                        disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                   {status === 'listening' ? <StopCircleIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-10 h-10" />}
                </button>
                <p className="mt-4 font-semibold h-6">{getStatusText()}</p>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            {(aiFeedback || userTranscript) && (
                <Card className="mt-6">
                    <CardContent className="p-6 space-y-4">
                        {userTranscript && (
                            <div>
                                <h3 className="font-bold mb-2">Transkrip Bacaan Anda:</h3>
                                <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80 italic">"{userTranscript}"</p>
                            </div>
                        )}
                         {aiFeedback && (
                            <div>
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-primary" />
                                    Maklum Balas AI:
                                </h3>
                                <div className="flex items-start gap-3">
                                    <p className="text-sm flex-1">{aiFeedback}</p>
                                    {feedbackAudioRef.current && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => playTrack({ src: feedbackAudioRef.current!, title: 'ai-feedback', type: 'wav_base64' })}
                                        >
                                            <SpeakerWaveIcon className={`w-5 h-5 ${isPlaying && track?.title === 'ai-feedback' ? 'text-primary' : ''}`} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
