import React, { useState, useRef, useEffect } from 'react';
// FIX: Removed non-exported 'LiveSession' type.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { MicrophoneIcon, SparklesIcon, StopCircleIcon, ChevronLeftIcon } from './icons/Icons';
import { PracticeMaterial, TajweedSession } from '../types';
import { addTajweedSession } from '../services/dbService';

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

interface TajweedCoachProps {
    practiceMaterial: PracticeMaterial;
    onBack: () => void;
}


export const TajweedCoach: React.FC<TajweedCoachProps> = ({ practiceMaterial, onBack }) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'processing' | 'speaking'>('idle');
    const [transcripts, setTranscripts] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
    const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
    
    // FIX: 'LiveSession' is not exported, using 'any' for the session type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const currentAiResponseRef = useRef<string>('');

    const saveSession = async () => {
        if (transcripts.length > 0) {
            const sessionData: Omit<TajweedSession, 'id'> = {
                material: practiceMaterial,
                transcripts: transcripts,
                timestamp: Date.now(),
            };
            try {
                await addTajweedSession(sessionData);
                console.log('Tajweed session saved.');
            } catch (error) {
                console.error('Failed to save Tajweed session:', error);
            }
        }
    };


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
        setHighlightedWords([]);
        currentAiResponseRef.current = '';

        try {
            if (!process.env.API_KEY) throw new Error("API Key not found");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const iqraInstruction = `Anda adalah seorang guru Iqra' AI yang sabar dan menggalakkan, pakar dalam makhraj (sebutan huruf) dan harakat (bunyi vokal). Pengguna akan membaca satu baris daripada buku Iqra'. Misi anda adalah untuk memberikan maklum balas yang spesifik dan membina dalam Bahasa Melayu. Lakukan perkara berikut:
1. Dengar dengan teliti bacaan pengguna.
2. Kenal pasti satu atau dua kesilapan paling utama dalam makhraj atau harakat.
3. Berikan maklum balas yang jelas. Contohnya, 'Bacaan anda bagus. Cuba sebut huruf 'خ' (kha) dengan lebih tebal dari kerongkong' atau 'Pastikan bunyi 'i' (kasrah) untuk 'بِ' (bi) lebih jelas'.
4. PENTING: Apabila anda merujuk kepada perkataan tertentu dari teks latihan yang perlu diperbaiki, balut perkataan *tepat* itu dalam dua tanda bintang. Contohnya, jika teks latihan ialah 'خَرَجَ' dan sebutan 'خ' salah, maklum balas anda sepatutnya seperti: 'Bacaan anda bagus. Untuk perkataan **خَرَجَ**, cuba sebut huruf 'خ' dengan lebih tebal.' Ini akan menyerlahkan perkataan itu untuk pengguna.
5. Sentiasa kekalkan nada yang positif dan memberi semangat. Pastikan maklum balas anda pendek dan mudah difahami oleh seorang pemula.`;
            const quranInstruction = `Anda adalah seorang jurulatih Tajwid AI yang pakar. Pengguna akan membaca beberapa ayat Al-Quran. Misi anda adalah untuk memberikan maklum balas yang terperinci dan profesional mengenai hukum Tajwid dalam Bahasa Melayu. Lakukan perkara berikut:
1. Analisis bacaan pengguna dari segi makhraj, sifat huruf, dan hukum Tajwid (contohnya, Ikhfa', Idgham, Qalqalah, Mad).
2. Kenal pasti kawasan utama untuk penambahbaikan.
3. Berikan maklum balas yang spesifik dengan menamakan hukum Tajwid yang berkaitan. Contohnya, 'Pada kalimah 'مِنْ شَرِّ', anda telah melakukan Idgham Ma'al Ghunnah dengan baik. Cuba panjangkan dengung sedikit lagi' atau 'Untuk 'أَنْعَمْتَ', pastikan anda jelaskan bunyi 'ن' (nun) sukun tanpa dengung kerana ia adalah hukum Izhar Halqi'.
4. Kekalkan nada yang profesional tetapi memberi galakan. Berikan cadangan yang boleh diambil tindakan.`;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: practiceMaterial.type === 'iqra' ? iqraInstruction : quranInstruction,
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
                        saveSession();
                        setStatus('idle');
                        cleanupAudio();
                    },
                    onclose: () => {
                        console.log('Session closed');
                        saveSession();
                        cleanupAudio();
                        setStatus('idle');
                    },
                }
            });

        } catch (error) {
            console.error("Failed to start session:", error);
            setStatus('idle');
        }
    };
    
    const handleServerMessage = async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription?.text) {
             currentAiResponseRef.current = ''; // Reset for AI's next turn
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
            const rawChunk = message.serverContent.outputTranscription.text;
            currentAiResponseRef.current += rawChunk;

            // Parse highlights from the cumulative raw text
            if (practiceMaterial.type === 'iqra') {
              const highlights = [...currentAiResponseRef.current.matchAll(/\*\*(.*?)\*\*/g)].map(match => match[1]);
              setHighlightedWords([...new Set(highlights)]);
            }

            // Update displayed transcript (cleaned of markers)
            const cleanFullText = currentAiResponseRef.current.replace(/\*\*/g, '');
            setTranscripts(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === 'ai') {
                    last.text = cleanFullText;
                    return [...prev.slice(0, -1), last];
                }
                return [...prev, { sender: 'ai', text: cleanFullText }];
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
        // cleanup is called in onclose which will also save the session
    };

    useEffect(() => {
        return () => {
             sessionPromiseRef.current?.then(session => session.close());
             cleanupAudio();
        };
    }, []);

    const getStatusText = () => {
        switch (status) {
            case 'idle': return 'Mula Sesi Latihan';
            case 'connecting': return 'Menyambung...';
            case 'listening': return 'Sedia Mendengar...';
            case 'processing': return 'Menganalisis...';
            case 'speaking': return 'AI Sedang Bercakap...';
            default: return 'Mula Sesi Latihan';
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-xl font-bold text-primary-light dark:text-primary-dark ml-2">{practiceMaterial.title}</h2>
            </div>
            
            <p className="text-foreground-light/80 mb-8">Dapatkan maklum balas masa-nyata untuk bacaan anda.</p>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-sm">
                <div dir="rtl" className="font-arabic text-3xl mb-6 text-foreground-light dark:text-foreground-dark text-right leading-relaxed space-y-4">
                    {practiceMaterial.content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex}>
                            {line.split(' ').map((word, wordIndex) => {
                                const isHighlighted = highlightedWords.includes(word);
                                return (
                                    <span key={wordIndex} className={`transition-colors duration-300 ${isHighlighted ? 'bg-accent/30 rounded-md' : ''}`}>
                                        {word}{' '}
                                    </span>
                                );
                            })}
                        </p>
                    ))}
                </div>

                <p className="mb-8 text-foreground-light/80">Tekan butang untuk mula merakam bacaan anda bagi teks di atas.</p>

                <button
                    onClick={status === 'idle' ? startSession : stopSession}
                    disabled={status === 'connecting' || status === 'processing'}
                    className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 text-white
                        ${status !== 'idle' ? 'bg-primary hover:bg-primary/90 animate-pulse' : 'bg-accent hover:bg-accent/90'}
                        disabled:bg-foreground-light/50 disabled:cursor-not-allowed`}
                >
                   {status !== 'idle' ? <StopCircleIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-10 h-10" />}
                </button>
                <p className="mt-4 font-semibold h-6">{getStatusText()}</p>

                {transcripts.length > 0 && (
                    <div className="mt-8 text-left p-6 bg-background-light dark:bg-background-dark rounded-lg max-h-64 overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 sticky top-0 bg-card-light dark:bg-card-dark py-2"><SparklesIcon className="text-accent"/> Transkrip Sesi</h3>
                        <div className="space-y-3">
                            {transcripts.map((t, i) => (
                                <div key={i}>
                                    <p className={`font-semibold ${t.sender === 'user' ? 'text-primary' : 'text-foreground-light dark:text-foreground-dark'}`}>
                                        {t.sender === 'user' ? 'Anda' : 'Tutor AI'}
                                    </p>
                                    <p className="text-foreground-light/80 dark:text-foreground-dark/80">{t.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
