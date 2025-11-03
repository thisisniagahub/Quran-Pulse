import React, { useState, useEffect, useRef } from 'react';
import type { PracticeMaterial, TajweedSession } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getTajweedFeedback, TajweedFeedback } from '../services/geminiService';
import { addTajweedSession } from '../services/dbService';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { MicrophoneIcon, StopCircleIcon, ChevronLeftIcon, SparklesIcon, CheckCircleIcon } from './icons/Icons';
import type { Agent } from '../lib/agents';
import audioWorkerManager from '../utils/workerManager';

interface TajweedCoachProps {
    practiceMaterial: PracticeMaterial;
    onBack: () => void;
    agent: Agent;
}

export const TajweedCoach: React.FC<TajweedCoachProps> = ({ practiceMaterial, onBack, agent }) => {
    const [transcript, setTranscript] = useState('');
    const [isFinal, setIsFinal] = useState(false);
    const [feedback, setFeedback] = useState<TajweedFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useWorker, setUseWorker] = useState(true);

    const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition({
        onResult: (text, final) => {
            setTranscript(text);
            setIsFinal(final);
        },
        onError: (err) => {
            setError(err);
            setIsLoading(false);
        },
        onEnd: () => {
            // Automatically get feedback when speech recognition ends and there's a transcript
            if (transcript && isFinal) {
                handleGetFeedback();
            }
        }
    });
    
    // Trigger feedback when transcript becomes final
    useEffect(() => {
        if (isFinal && transcript && !isListening && !isLoading && !feedback) {
            handleGetFeedback();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFinal, transcript, isListening]);


    const handleGetFeedback = async () => {
        if (!transcript) return;
        setIsLoading(true);
        setError(null);
        setFeedback(null);
        
        try {
            let fb: TajweedFeedback | null = null;
            
            if (useWorker) {
                // Use Web Worker for heavy processing to keep UI responsive
                fb = await audioWorkerManager.analyzeTajweed(practiceMaterial.content, transcript);
            } else {
                // Fallback to direct API call
                fb = await getTajweedFeedback(practiceMaterial.content, transcript, agent);
            }
            
            if (fb) {
                setFeedback(fb);
                const sessionData: Omit<TajweedSession, 'id' | 'timestamp'> = {
                    material: practiceMaterial,
                    transcripts: [
                        { sender: 'ai', text: practiceMaterial.content },
                        { sender: 'user', text: transcript }
                    ],
                    accuracy: fb.accuracy,
                };
                await addTajweedSession(sessionData);
            } else {
                setError("Gagal mendapatkan maklum balas. Sila cuba lagi.");
            }
        } catch (err) {
            console.error('Error getting feedback:', err);
            setError("Ralat berlaku semasa mendapatkan maklum balas. Sila cuba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetPractice = () => {
        setTranscript('');
        setIsFinal(false);
        setFeedback(null);
        setError(null);
    };
    
    if (!isSupported) {
        return <div className="text-center p-8 bg-primary/10 text-primary rounded-lg">Pengecaman pertuturan tidak disokong pada pelayar anda. Sila gunakan Chrome atau Safari versi terkini.</div>
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Button onClick={onBack} variant="ghost" className="mb-4"><ChevronLeftIcon /> Kembali</Button>
            
            <Card className="mb-6">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">{practiceMaterial.title}</h2>
                    <p dir="rtl" className="font-arabic text-4xl text-center leading-relaxed p-4 bg-background-light dark:bg-background-dark rounded-lg">
                        {practiceMaterial.content}
                    </p>
                </CardContent>
            </Card>

            <div className="text-center mb-6">
                 <button
                    onClick={isListening ? stopListening : startListening}
                    className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 text-white ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
                >
                   {isListening ? <StopCircleIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-10 h-10" />}
                </button>
                 <p className="mt-4 font-semibold h-6">
                    {isListening ? "Mendengar..." : (feedback ? "Sesi Selesai" : "Tekan untuk mula merakam")}
                 </p>
                 
                 {/* Toggle for Web Worker usage - for debugging/optimization */}
                 <div className="mt-2 text-sm">
                     <label className="inline-flex items-center cursor-pointer">
                         <input
                             type="checkbox"
                             checked={useWorker}
                             onChange={(e) => setUseWorker(e.target.checked)}
                             className="sr-only peer"
                         />
                         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                         <span className="ms-3">Gunakan Web Worker</span>
                     </label>
                 </div>
            </div>
            
             {error && <div className="text-center p-4 bg-primary/10 text-primary rounded-lg my-4">{error}</div>}

            {(transcript || isLoading || feedback) && (
                <Card>
                    <CardContent className="p-6">
                         <h3 className="font-bold text-lg mb-4">Hasil Sesi</h3>
                         {transcript && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-sm mb-2">Transkrip Anda:</h4>
                                <p dir="rtl" className="font-arabic text-2xl p-3 bg-background-light dark:bg-background-dark rounded-md">{transcript}</p>
                            </div>
                         )}
                         {isLoading && <div className="text-center p-4">Menganalisis bacaan anda... <SparklesIcon className="w-5 h-5 inline-block animate-spin"/></div>}

                         {feedback && (
                             <div>
                                <h4 className="font-semibold text-sm mb-2 text-primary">Maklum Balas AI ({agent.name}):</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-primary/10 rounded-lg">
                                        <p className="font-bold text-3xl text-center text-primary mb-2">{feedback.accuracy}%</p>
                                        <p className="text-sm text-center font-semibold">Skor Ketepatan</p>
                                    </div>
                                    <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                                        <p className="font-semibold text-sm mb-1">Rumusan</p>
                                        <p>{feedback.feedback}</p>
                                    </div>
                                    <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                                        <p className="font-semibold text-sm mb-2">Saranan Penambahbaikan</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {feedback.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <Button onClick={resetPractice} className="w-full mt-6">Cuba Lagi</Button>
                             </div>
                         )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};