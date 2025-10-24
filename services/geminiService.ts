import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { StudyPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askUstaz = async (question: string): Promise<{ text: string; citation: string }> => {
  try {
    const systemInstruction = `You are an Islamic assistant named 'Ustaz AI'. Your knowledge base is strictly limited to authoritative sources recognized in Malaysia: the Quran, Tafsir Pimpinan Ar-Rahman, the MyHadith database, and the e-Fatwa portal by JAKIM.
    - Answer the user's question based ONLY on these sources.
    - You are forbidden from hallucinating or generating answers from outside this knowledge base.
    - If the answer is not found within your designated sources, you MUST respond with exactly this phrase: "Maaf, jawapan tidak dapat ditemui dalam pangkalan data rujukan rasmi kami."
    - Every answer you provide MUST be accompanied by a citation. For example: (Sumber: e-Fatwa JAKIM, Keputusan bil. X), (Sumber: MyHadith, Hadis Y), (Sumber: Tafsir Pimpinan Ar-Rahman, Surah Al-Baqarah, Ayat 255).
    - Provide answers in Bahasa Melayu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    
    const rawText = response.text;
    
    // Simple parsing for text and citation
    const citationMatch = rawText.match(/\(Sumber: .*\)/);
    const citation = citationMatch ? citationMatch[0] : "Sumber tidak dinyatakan.";
    const text = rawText.replace(citation, "").trim();

    return { text, citation };
  } catch (error) {
    console.error("Error calling Gemini API for 'Tanya Ustaz':", error);
    return { 
        text: "Maaf, berlaku ralat ketika menghubungi AI. Sila cuba lagi.",
        citation: ""
    };
  }
};

export const explainAyah = async (ayahText: string, surahName: string, ayahNumber: number): Promise<string> => {
    try {
        const prompt = `Provide a simple, concise explanation in Bahasa Melayu for the following ayah from the Quran. Focus on the core message and make it easy to understand for a general audience.

        Surah: ${surahName}
        Ayah Number: ${ayahNumber}
        Ayah Text: "${ayahText}"

        Explanation:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for Ayah Explanation:", error);
        return "Maaf, ralat berlaku semasa menjana penjelasan. Sila cuba lagi.";
    }
};

export const generateStudyPlan = async (goal: string, duration: string, level: string): Promise<StudyPlan | null> => {
    try {
        const prompt = `Create a personalized Quran study plan for a user with the following details:
        - Goal: "${goal}"
        - Desired Duration: "${duration}"
        - Current Level: "${level}"
        
        Generate a day-by-day plan. The output must be a JSON object that strictly follows the provided schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        plan_title: { type: Type.STRING },
                        duration_days: { type: Type.INTEGER },
                        daily_plan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.INTEGER },
                                    topic: { type: Type.STRING },
                                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    estimated_time: { type: Type.STRING }
                                },
                                required: ["day", "topic", "tasks", "estimated_time"]
                            }
                        }
                    },
                    required: ["plan_title", "duration_days", "daily_plan"]
                }
            }
        });
        
        const jsonText = response.text;
        return JSON.parse(jsonText) as StudyPlan;

    } catch (error) {
        console.error("Error calling Gemini API for Study Plan:", error);
        return null;
    }
}

export const generateSpeech = async (text: string): Promise<string | null> => {
    if (!text || !text.trim()) {
        return null;
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, pleasant voice
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data in response");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error calling Gemini API for Speech Generation:", error);
        return null;
    }
};

export const convertToJawi = async (text: string): Promise<string> => {
    try {
        const prompt = `Transliterate the following Malay text from Rumi script to Jawi script. Provide only the Jawi text as the output, with no additional explanation or introductory text. Text to convert: "${text}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for Jawi Conversion:", error);
        return "Maaf, berlaku ralat semasa menukar teks.";
    }
};