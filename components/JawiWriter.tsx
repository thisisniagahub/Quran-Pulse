import React, { useState } from 'react';
import { convertToJawi } from '../services/geminiService';
import { SparklesIcon } from './icons/Icons';

export const JawiWriter: React.FC = () => {
    const [rumiText, setRumiText] = useState('');
    const [jawiText, setJawiText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!rumiText.trim()) {
            setError('Sila masukkan teks Rumi untuk ditukar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setJawiText('');

        try {
            const result = await convertToJawi(rumiText);
            setJawiText(result);
        } catch (err) {
            setError('Gagal menukar teks. Sila cuba lagi.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Penulis Jawi AI</h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Tukar teks Rumi ke tulisan Jawi dengan mudah.</p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="rumi-input" className="block text-sm font-medium mb-2">Teks Rumi</label>
                        <textarea
                            id="rumi-input"
                            rows={8}
                            value={rumiText}
                            onChange={(e) => setRumiText(e.target.value)}
                            placeholder="Taip teks Rumi di sini..."
                            className="w-full p-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="jawi-output" className="block text-sm font-medium mb-2">Tulisan Jawi</label>
                        <div
                            id="jawi-output"
                            dir="rtl"
                            className="w-full h-full min-h-[190px] p-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark font-arabic text-2xl"
                        >
                            {jawiText}
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

                <div className="mt-6 text-center">
                    <button
                        onClick={handleConvert}
                        disabled={isLoading}
                        className="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-foreground-light/20 dark:disabled:bg-foreground-dark/20"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Menukar...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon />
                                <span>Tukar ke Jawi</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};