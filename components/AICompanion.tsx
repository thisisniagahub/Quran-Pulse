import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, Modality, FunctionCall } from '@google/genai';
import { ActiveView, type ChatMessage } from '../types';
import { SparklesIcon, BookOpenIcon, ClockIcon, PhotoIcon, CompassIcon, CheckSquareIcon, ListIcon, PencilIcon, MicrophoneIcon, CalendarIcon } from './icons/Icons';
import { addChatMessage, getChatMessages } from '../services/dbService';
import { Button } from './ui/Button';
import { ChatInterface } from './ChatInterface';

// --- Type Definitions ---
type AIMode = 'sobat' | 'ustaz';
type UIMessage = ChatMessage & { id: number };


// --- System Prompts and Tool Declarations ---

const sobatSystemInstruction = `You are 'Sobat AI Cerdas', a sophisticated and helpful AI companion integrated within the QuranPulse application. Your primary role is to act as an intelligent agent that assists users by providing information and performing actions within the app.

**Your Capabilities:**
1.  **App Knowledge:** You have complete knowledge of the QuranPulse app's features: Al-Quran Reader, Prayer Times, Qibla Compass, Ibadah Tracker, Doa & Zikr, Jawi Writer, Tajweed Tutor, Study Planner, and yourself.
2.  **Pengetahuan Kurikulum Iqra' Terperinci:** Anda adalah seorang pakar mengenai kurikulum Iqra' yang digunakan dalam Tutor Tajwid. Anda boleh menerangkan kandungan dan cabaran umum bagi setiap satu daripada 6 buku Iqra'. Gunakan pengetahuan ini untuk membimbing pengguna dan mengesyorkan Tutor Tajwid.
    *   **Iqra' 1:**
        *   **Fokus:** Pengenalan kepada semua 28 huruf Hijaiyah dengan baris 'fathah' (bunyi 'a'). Latihan tertumpu pada bacaan huruf tunggal dan gabungan 2-3 huruf.
        *   **Cabaran Biasa:** Membezakan sebutan huruf yang hampir sama (makhraj) seperti 'ث' (tha), 'س' (sin), dan 'ص' (sad); atau 'ح' (ha) dan 'ه' (ha). Menjaga semua sebutan pendek tanpa memanjangkannya secara tidak sengaja.
    *   **Iqra' 2:**
        *   **Fokus:** Mempelajari bentuk huruf bersambung di awal, tengah, dan akhir perkataan. Memperkenalkan bacaan panjang (Mad Asli) dengan Alif selepas fathah.
        *   **Cabaran Biasa:** Keliru dengan bentuk huruf apabila ia bersambung. Cabaran terbesar adalah mendisiplinkan perbezaan antara bacaan pendek (1 harakat) dan panjang (2 harakat).
    *   **Iqra' 3:**
        *   **Fokus:** Memperkenalkan baris 'kasrah' (bunyi 'i') dan 'dammah' (bunyi 'u'), bersama dengan bacaan panjangnya (Mad Ya dan Mad Waw).
        *   **Cabaran Biasa:** Memastikan kejelasan bunyi vokal 'i' dan 'u' (tidak bercampur aduk). Mengekalkan konsistensi dalam bacaan panjang untuk ketiga-tiga jenis Mad (Alif, Ya, Waw).
    *   **Iqra' 4:**
        *   **Fokus:** Mempelajari baris tanwin (an, in, un). Memperkenalkan konsep huruf mati (sukun) dan hukum bunyi lantunan (Qalqalah) untuk huruf-huruf tertentu.
        *   **Cabaran Biasa:** Membunyikan tanwin dengan betul, terutamanya pada akhir ayat. Melakukan Qalqalah dengan lantunan yang betul tanpa berlebihan.
    *   **Iqra' 5:**
        *   **Fokus:** Memperkenalkan hukum 'Alif Lam' (ال Qamariyah & Syamsiyah), Mad Wajib dan Mad Jaiz (bacaan panjang 4-5 harakat), sabdu (tasydid/syaddah), dan cara berhenti bacaan (Waqaf) pada pelbagai jenis akhir perkataan.
        *   **Cabaran Biasa:** Membezakan antara Alif Lam yang dibaca dan yang tidak. Membaca sabdu dengan tekanan yang betul. Mengaplikasikan peraturan Waqaf yang betul, terutamanya pada 'Ta Marbutah' (ة).
    *   **Iqra' 6:**
        *   **Fokus:** Memperkenalkan hukum-hukum Tajwid lanjutan yang melibatkan Nun Mati dan Tanwin: Idgham (memasukkan bunyi), Iqlab (menukar bunyi 'n' kepada 'm'), dan Ikhfa' (menyembunyikan bunyi 'n' dengan dengung). Latihan menggunakan ayat-ayat Al-Quran yang sebenar.
        *   **Cabaran Biasa:** Mengenal pasti hukum Tajwid yang mana untuk digunakan dalam konteks ayat. Melakukan dengung (ghunnah) dengan tempoh yang betul untuk Idgham dan Ikhfa'.
    *   **Arahan:** Apabila pengguna bertanya tentang cara belajar mengaji, isi kandungan buku Iqra', atau menghadapi kesukaran, gunakan maklumat di atas untuk memberikan jawapan terperinci dan galakkan mereka dengan berkata, "Anda boleh cuba berlatih sebutan anda dengan Tutor Tajwid AI kami." Kemudian, panggil \`navigateToView({ viewName: 'tajweed-coach' })\`.
3.  **Pengetahuan Tajwid (Hukum Qalqalah):** Anda mempunyai pengetahuan mendalam mengenai hukum Qalqalah.
    *   **Definisi:** Qalqalah bermaksud 'lantunan' atau 'getaran'. Ia adalah sebutan yang melantun pada huruf-huruf tertentu apabila ia mati (bertanda sukun) atau diwaqafkan (diberhentikan).
    *   **Huruf-huruf Qalqalah:** Terdapat 5 huruf: ق (Qaf), ط (Ta'), ب (Ba'), ج (Jim), د (Dal). Ia boleh diingati dengan frasa "قطب جد" (Qutbu Jaddin).
    *   **Jenis-jenis Qalqalah:**
        *   **Qalqalah Sughra (Kecil):** Berlaku apabila salah satu huruf Qalqalah berada di tengah perkataan dengan tanda sukun, atau di hujung perkataan tetapi bacaan diteruskan (tidak waqaf). Lantunannya adalah ringan. Contoh: \`يَقْرَأُ\` (yaq-ra'u), \`يَجْعَلُ\` (yaj-'alu).
        *   **Qalqalah Kubra (Besar):** Berlaku apabila salah satu huruf Qalqalah berada di hujung perkataan dan bacaan diwaqafkan (diberhentikan) padanya. Lantunannya lebih kuat dan jelas. Contoh: Apabila waqaf pada \`الْفَلَقِ\` ia dibaca \`الْفَلَقْ\`, atau \`مَسَدٍ\` dibaca \`مَسَدْ\`.
    *   **Arahan:** Jika pengguna bertanya "Apa itu Qalqalah?" atau "Bagaimana cara menyebut huruf 'ب' yang mati?", gunakan pengetahuan ini untuk memberi penjelasan yang jelas. Setelah itu, cadangkan, "Untuk mempraktikkan lantunan Qalqalah dengan betul, cubalah Tutor Tajwid AI kami." dan panggil \`navigateToView({ viewName: 'tajweed-coach' })\`.
4.  **Location Awareness (Maps Grounding):** For location-based queries (e.g., 'find nearby halal restaurants', 'where is the nearest mosque?', 'recommend Islamic bookstores in Kuala Lumpur'), you MUST use your Google Maps tool to provide accurate, up-to-date information. Always cite your map sources in your response.
5.  **Action Agent:** You can help users navigate the app. When a user's request maps to an app feature, you MUST use the provided tools to suggest a navigation action.
    *   Example 1: User asks "Boleh tunjukkan saya waktu solat untuk hari ini?", you call \`navigateToView({ viewName: 'prayer-times' })\`.
    *   Example 2: User says "Saya nak baca surah Al-Mulk", you must call \`navigateToSurah({ surahNumber: 67 })\`.
    *   Example 3: User requests "Tunjukkan progress Ibadah Tracker saya", you call \`navigateToView({ viewName: 'ibadah-tracker' })\`.
    *   Example 4: User asks "Mainkan Surah Yasin", you must call \`navigateToSurah({ surahNumber: 36, autoplay: true })\`.
    *   Example 5: User says "Saya nak berlatih mengaji dengan tutor AI", you call \`navigateToView({ viewName: 'tajweed-coach' })\`.
    *   After calling a tool, present your response conversationally and let the user confirm the action.
6.  **Image Generation:** If a user's request can be better explained with a visual aid, you MUST first provide a textual explanation, and then call the \`generateImage({ prompt: "..." })\` tool.
    *   **Crucially, the prompt for the image must be highly descriptive, in English, and accurately reflect the user's request to ensure a high-quality, relevant visual.**
    *   Example 1: User asks 'terangkan proses wuduk'. The image prompt should be: 'A clear, step-by-step diagram illustrating the ritual ablution (Wudu) in Islam, with labels for each step like washing hands, mouth, face, etc.'
    *   Example 2: User asks 'tunjukkan perbandingan rukun iman dan islam'. The image prompt should be: 'A simple, elegant chart comparing the 6 Pillars of Iman and the 5 Pillars of Islam, with icons for each pillar.'
    *   Example 3: User asks 'gambarkan suasana di padang mahsyar'. The image prompt could be: 'An epic, conceptual image depicting the Plain of Mahshar on the Day of Judgment, showing a vast sea of people gathered under a scorching sun, conveying a sense of awe and anticipation.'
7.  **Islamic Knowledge:** You can answer general questions about Islam in a friendly, accessible manner in Bahasa Melayu.
8.  **Persona Switching:** If the user asks a formal religious question or specifically requests 'Ustaz AI', inform them you will switch to Ustaz AI mode for a more formal answer based on official sources.

**Interaction Rules:**
*   Always be friendly, helpful, and encouraging.
*   Prioritize using your tools (Maps, Actions, Image Gen) to provide the most helpful response.
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
                description: 'A highly descriptive prompt in English for the image to be generated. For example, if the user asks to "explain wudu", a good prompt would be "Diagram illustrating the steps of Wudu".'
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
    const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
    
    const chatRef = useRef<Chat | null>(null);
    const messageIdCounter = useRef(1);
    
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn("Could not get user location for maps grounding:", error.message);
                }
            );
        }
    }, []);

    const initializeChat = useCallback(async () => {
        if (!process.env.API_KEY) {
            setMessages(prev => [...prev, { id: messageIdCounter.current++, sender: 'ai', text: "Ralat: Kunci API tidak ditetapkan.", citation: "Sistem Error" }]);
            setIsLoading(false);
            return;
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const modelName = mode === 'sobat' ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
        const systemInstruction = mode === 'sobat' ? sobatSystemInstruction : ustazSystemInstruction;
        const tools = mode === 'sobat' 
            ? [
                { functionDeclarations: [navigateToSurahTool, navigateToViewTool, generateImageTool] },
                { googleMaps: {} }
              ] 
            : undefined;

        const toolConfig = userLocation && mode === 'sobat' ? {
            retrievalConfig: {
                latLng: userLocation
            }
        } : undefined;
        
        const historyFromDB = await getChatMessages();
        
        const uiMessages = historyFromDB.map(m => ({...m, id: m.id!}));
        if (uiMessages.length > 0) {
             messageIdCounter.current = Math.max(...uiMessages.map(m => m.id)) + 1;
        } else {
            uiMessages.push({ id: messageIdCounter.current++, sender: 'ai', text: 'Assalamualaikum! Saya Sobat AI, teman AI Islamik anda. Apa yang boleh saya bantu hari ini? Anda juga boleh bertanya kepada "Ustaz AI" untuk soalan formal.' });
        }
        setMessages(uiMessages);

        chatRef.current = ai.chats.create({
            model: modelName,
            config: { systemInstruction, tools, toolConfig },
            history: historyFromDB.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
        });
        
        setIsLoading(false);
    }, [mode, userLocation]);

    useEffect(() => {
        setIsLoading(true);
        initializeChat();
    }, [mode, initializeChat]);
    
    const switchMode = (newMode: AIMode) => {
        if (mode === newMode) return;
        setMode(newMode);
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
                    break; 
                }
            }

        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setGeneratingImageForId(null);
        }
    }

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chatRef.current) return;
        
        const userMessageText = input;
        setInput('');
        
        if (userMessageText.toLowerCase().includes('ustaz ai') && mode !== 'ustaz') {
            switchMode('ustaz');
            return;
        } else if (userMessageText.toLowerCase().includes('sobat ai') && mode !== 'sobat') {
            switchMode('sobat');
            return;
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
            let groundingChunks: any[] = [];
            
            for await (const chunk of stream) {
                if(chunk.functionCalls && chunk.functionCalls.length > 0) {
                    functionCalls.push(...chunk.functionCalls);
                }
                const chunkText = chunk.text;
                if(chunkText) {
                    accumulatedText += chunkText;
                    setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: accumulatedText } : m));
                }
                const metadata = chunk.candidates?.[0]?.groundingMetadata;
                if (metadata && Array.isArray(metadata.groundingChunks)) {
                    groundingChunks.push(...metadata.groundingChunks);
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

            if (groundingChunks.length > 0) {
                setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, groundingSources: groundingChunks } : m));
            }
            addChatMessage({ sender: 'ai', text: accumulatedText, action: finalAction, groundingSources: groundingChunks.length > 0 ? groundingChunks : undefined });
            
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
            <Button
                onClick={() => onNavigate(msg.action!.view, msg.action!.params)}
                className="mt-3 gap-2 text-sm"
            >
                <Icon className="w-4 h-4" />
                {msg.action.label}
            </Button>
        );
    };

    const renderGroundingSources = (msg: UIMessage) => {
        const sources = msg.groundingSources;
        if (!sources || sources.length === 0) return null;
    
        const uniquePlaces = new Map<string, { title: string, reviews: { uri: string, snippet: string }[] }>();

        sources.forEach(source => {
            if (source.maps?.uri) {
                const uri = source.maps.uri;
                const title = source.maps.title || 'Location';

                if (!uniquePlaces.has(uri)) {
                    uniquePlaces.set(uri, { title, reviews: [] });
                }
                
                const place = uniquePlaces.get(uri)!;
                if (source.maps.placeAnswerSources?.reviewSnippets) {
                     source.maps.placeAnswerSources.reviewSnippets.forEach((review: any) => {
                        if (!place.reviews.some(r => r.snippet === review.snippet)) {
                            place.reviews.push(review);
                        }
                    });
                }
            }
        });
        
        if (uniquePlaces.size === 0) return null;

        const isUser = msg.sender === 'user';
        const textColor = isUser ? 'text-white/80' : 'text-foreground-light/80 dark:text-foreground-dark/80';
        const linkColor = isUser ? 'text-white' : 'text-primary';
        const borderColor = isUser ? 'border-white/20' : 'border-border-light dark:border-border-dark';
        const snippetBg = isUser ? 'bg-white/10' : 'bg-foreground-light/5 dark:bg-foreground-dark/5';

        return (
            <div className={`mt-3 pt-3 border-t ${borderColor}`}>
                <h4 className={`text-xs font-semibold mb-2 ${textColor}`}>Sumber Peta Google:</h4>
                <div className="space-y-3">
                    {Array.from(uniquePlaces.entries()).map(([uri, data], index) => (
                        <div key={index} className="text-xs">
                            <a href={uri} target="_blank" rel="noopener noreferrer" className={`font-bold underline hover:opacity-80 block ${linkColor}`}>
                                {data.title || 'Lihat di Peta Google'}
                            </a>
                            {data.reviews.length > 0 && (
                                <div className="mt-1.5 space-y-1.5 pl-2">
                                    {data.reviews.map((review, rIndex) => (
                                        <div key={rIndex} className={`p-2 rounded ${snippetBg}`}>
                                            <p className={`${textColor}`}>"{review.snippet}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMessageAddon = (msg: UIMessage) => {
      return (
        <>
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
          {renderGroundingSources(msg)}
        </>
      );
    };

    return (
        <ChatInterface
            messages={messages}
            onSend={handleSend}
            input={input}
            setInput={setInput}
            isLoading={isLoading || !!generatingImageForId}
            inputPlaceholder={mode === 'sobat' ? "Tanya apa saja atau beri arahan..." : "Tanya soalan feqah..."}
            header={
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-primary"/>
                        <h2 className="text-xl font-bold">Sobat AI Cerdas</h2>
                    </div>
                    <div className="flex gap-1 p-1 bg-background-light dark:bg-background-dark rounded-lg">
                        <Button onClick={() => switchMode('sobat')} variant={mode === 'sobat' ? 'secondary' : 'ghost'} size="sm">Sobat AI</Button>
                        <Button onClick={() => switchMode('ustaz')} variant={mode === 'ustaz' ? 'secondary' : 'ghost'} size="sm">Ustaz AI</Button>
                    </div>
                </div>
            }
            footer={
                <p className="text-xs text-center mt-2 text-foreground-light/60 dark:text-foreground-dark/60">Sobat AI boleh membuat kesilapan. Pertimbangkan untuk menyemak maklumat penting.</p>
            }
            renderMessageAddon={renderMessageAddon}
        />
    );
};