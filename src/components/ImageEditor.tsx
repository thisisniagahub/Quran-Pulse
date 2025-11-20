import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { SparklesIcon, ImageIcon, DownloadIcon, XIcon } from './icons/Icons';
import { editImage } from '../services/geminiService';
import { cn } from '../lib/utils';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // result is a data URL (e.g., "data:image/jpeg;base64,...")
            // We need to strip the prefix
            const base64String = reader.result?.toString().split(',')[1];
            if (base64String) {
                resolve(base64String);
            } else {
                reject(new Error('Failed to convert blob to base64'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setOriginalImagePreview(URL.createObjectURL(file));
            setEditedImage(null); // Clear previous edit
            setError(null);
        }
    };

    const handleClearImage = () => {
        setOriginalImage(null);
        setOriginalImagePreview(null);
        setEditedImage(null);
        setError(null);
        setPrompt('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleGenerate = async () => {
        if (!originalImage || !prompt.trim()) {
            setError('Sila muat naik imej dan masukkan prom.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const base64Data = await blobToBase64(originalImage);
            const result = await editImage(base64Data, originalImage.type, prompt);

            if (result) {
                setEditedImage(result);
            } else {
                throw new Error('Gagal menerima imej yang diedit daripada AI.');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Berlaku ralat semasa menjana imej.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!editedImage) return;
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${editedImage}`;
        link.download = `edited-${originalImage?.name || 'image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
                    <SparklesIcon className="w-8 h-8" />
                    Editor Imej AI (PRO)
                </h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Sunting imej anda dengan mudah menggunakan arahan teks.</p>
            </div>

            {!originalImagePreview ? (
                <Card
                    className="border-2 border-dashed border-border-light dark:border-border-dark hover:border-primary transition-colors text-center p-12 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                    <h3 className="font-bold text-lg">Klik untuk muat naik imej</h3>
                    <p className="text-sm text-foreground-light/70">PNG, JPG, WEBP</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    Imej Asal
                                    <Button onClick={handleClearImage} variant="ghost" size="icon" aria-label="Clear image">
                                        <XIcon className="w-5 h-5" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img src={originalImagePreview} alt="Original" className="rounded-lg w-full aspect-square object-contain bg-background-light dark:bg-background-dark" />
                            </CardContent>
                        </Card>
                        <Card className={cn(editedImage || isLoading || error ? 'border-primary' : '')}>
                            <CardHeader>
                                <CardTitle>Imej Dijana</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg w-full aspect-square bg-background-light dark:bg-background-dark flex items-center justify-center">
                                    {isLoading && (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                            <p className="text-sm">AI sedang berfikir...</p>
                                        </div>
                                    )}
                                    {error && <p className="text-sm text-primary p-4">{error}</p>}
                                    {editedImage && <img src={`data:image/png;base64,${editedImage}`} alt="Edited" className="w-full h-full object-contain" />}
                                    {!isLoading && !error && !editedImage && (
                                         <p className="text-sm text-foreground-light/70">Hasil suntingan akan muncul di sini.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Cth: Tukar latar belakang kepada pantai"
                                    className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary"
                                    disabled={isLoading}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="flex-1 sm:flex-none gap-2">
                                        <SparklesIcon /> {isLoading ? 'Menjana...' : 'Jana Imej'}
                                    </Button>
                                    <Button onClick={handleDownload} disabled={!editedImage || isLoading} variant="secondary" className="flex-1 sm:flex-none gap-2">
                                        <DownloadIcon /> Muat Turun
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ImageEditor;