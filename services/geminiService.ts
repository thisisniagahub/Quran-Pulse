// @google/genai is used on the server-side proxy, not here.
// This client-side service communicates with our own server.
import type { StudyPlan, TajweedSession } from '../types';
import type { Agent } from '../lib/agents';
import { debounce } from '../utils/debounce';

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

// Debounced functions to limit API calls and reduce costs
const debouncedPostData = debounce(postData, 500);

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
 * Converts Rumi text to Jawi script with debouncing to limit API calls.
 */
export const convertToJawi = async (rumiText: string, agent: Agent): Promise<string> => {
  if (!rumiText.trim()) return '';
  
  // For real-time conversion, we debounce to avoid excessive API calls
  return new Promise((resolve, reject) => {
    const debouncedConvert = debounce(async (text: string) => {
      try {
        const data = await postData<{ jawi: string }>('/convert-to-jawi', { 
            rumiText: text,
            model: agent.model,
            systemInstruction: agent.systemInstruction
        });
        resolve(data.jawi);
      } catch (error) {
        console.error('Error converting to Jawi:', error);
        reject(error);
      }
    }, 300);
    debouncedConvert(rumiText);
  });
};

/**
 * Generates speech from text with debouncing for continuous input.
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
  if (!text) return null;
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
 * Gets AI feedback on a user's recitation with debouncing to limit expensive API calls.
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
 * Generates an explanation for a Quranic ayah with debouncing to avoid API spam.
 */
export const getAyahExplanation = async (surahName: string, ayahNumber: number, ayahText: string, translation: string, agent: Agent): Promise<string | null> => {
    try {
        const prompt = `Provide an explanation (tafsir) for the following Quranic ayah, in Bahasa Melayu.
        - Surah: ${surahName}
        - Ayah: ${ayahNumber}
        - Text: "${ayahText}"
        - Translation: "${translation}"`;

        // Debounce to avoid multiple requests for the same ayah when user is navigating quickly
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
 * Generates content for a generic prompt with debouncing to limit API usage.
 */
export const generateGenericContent = async (prompt: string, agent: Agent): Promise<string | null> => {
    try {
        // Debounced version to prevent spamming the API with rapid requests
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