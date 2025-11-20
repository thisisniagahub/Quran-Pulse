// @google/genai is used on the server-side proxy, not here.
// This client-side service communicates with our own server.
import type { StudyPlan, TajweedSession } from '../types';
import type { Agent } from '../lib/agents';

const API_BASE_URL = '/api'; // Use relative path for proxy

// A helper function for making API calls to our backend
async function postData<T>(url = '', data = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Generates a personalized study plan using the AI model.
 */
export const generateStudyPlan = async (goal: string, duration: string, level: string, agent: Agent): Promise<StudyPlan | null> => {
  try {
    const data = await postData<StudyPlan>('/generate-study-plan', { 
        goal, 
        duration, 
        level,
        model: agent.model,
        systemInstruction: agent.systemInstruction
    });
    return data;
  } catch (error) {
    console.error('Error generating study plan:', error);
    return null;
  }
};

/**
 * Converts Rumi text to Jawi script.
 */
export const convertToJawi = async (rumiText: string, agent: Agent): Promise<string> => {
  const data = await postData<{ jawi: string }>('/convert-to-jawi', { 
      rumiText,
      model: agent.model,
      systemInstruction: agent.systemInstruction
  });
  return data.jawi;
};

/**
 * Generates speech from text.
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const data = await postData<{ audioData: string }>('/generate-speech', { text });
        return data.audioData;
    } catch (error) {
        console.error('Error generating speech:', error);
        return null;
    }
};

/**
 * Defines the structure for Tajweed feedback from the AI.
 */
export interface TajweedFeedback {
  accuracy: number;
  feedback: string;
  improvements: string[];
}

/**
 * Gets AI feedback on a user's recitation.
 */
export const getTajweedFeedback = async (originalText: string, userTranscript: string, agent: Agent): Promise<TajweedFeedback | null> => {
    try {
        const data = await postData<TajweedFeedback>('/tajweed-feedback', { 
            originalText, 
            userTranscript,
            model: agent.model,
            systemInstruction: agent.systemInstruction
        });
        return data;
    } catch (error) {
        console.error('Error getting tajweed feedback:', error);
        return null;
    }
};

/**
 * Generates an explanation for a Quranic ayah.
 */
export const getAyahExplanation = async (surahName: string, ayahNumber: number, ayahText: string, translation: string, agent: Agent): Promise<string | null> => {
    try {
        const prompt = `Provide an explanation (tafsir) for the following Quranic ayah, in Bahasa Melayu.
        - Surah: ${surahName}
        - Ayah: ${ayahNumber}
        - Text: "${ayahText}"
        - Translation: "${translation}"`;

        const data = await postData<{ text: string }>('/generate-content', { 
            prompt,
            model: agent.model,
            systemInstruction: agent.systemInstruction
        });
        return data.text;
    } catch (error) {
        console.error('Error getting ayah explanation:', error);
        return "Maaf, tidak dapat memuatkan penjelasan pada masa ini.";
    }
};

/**
 * Generates content for a generic prompt.
 */
export const generateGenericContent = async (prompt: string, agent: Agent): Promise<string | null> => {
    try {
        const data = await postData<{ text: string }>('/generate-content', { 
            prompt,
            model: agent.model,
            systemInstruction: agent.systemInstruction
        });
        return data.text;
    } catch (error) {
        console.error('Error generating generic content:', error);
        return "Maaf, tidak dapat memuatkan jawapan pada masa ini.";
    }
};

// FIX: Add missing `editImage` function to resolve import error in ImageEditor.tsx.
/**
 * Sends an image and a prompt to the backend to be edited by the AI model.
 * @param imageData The base64 encoded image data (without the data URL prefix).
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @param prompt The text prompt describing the desired edit.
 * @returns A promise that resolves with the base64 string of the edited image, or null on error.
 */
export const editImage = async (imageData: string, mimeType: string, prompt: string): Promise<string | null> => {
    try {
        const data = await postData<{ imageData: string }>('/edit-image', {
            imageData,
            mimeType,
            prompt,
        });
        return data.imageData;
    } catch (error) {
        console.error('Error editing image:', error);
        return null;
    }
};
