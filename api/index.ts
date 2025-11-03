// FIX: Import Request and Response types directly from express to resolve type conflicts and overload errors.
import express, { Request, Response } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { GoogleGenAI, Modality } from '@google/genai';

// In Vercel, environment variables are managed in the project settings.
if (!process.env.GEMINI_API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined in the environment variables.");
}

const app = express();

// Middleware
app.use(cors());
// FIX: The `app.use` calls were failing due to incorrect type inference for the `express` module.
// Importing `Request` and `Response` explicitly and using them throughout the file resolves these overload issues.
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Terlalu banyak permintaan daripada IP ini, sila cuba lagi selepas 15 minit',
});
app.use(limiter);

// AI Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Error Handler Helper
// FIX: Use explicit `Response` type from express to ensure properties like 'status' and 'json' exist.
const handleApiError = (res: Response, error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    res.status(500).json({ error: `Failed to ${context}. Please try again.` });
};

// --- API Routes (prefixed with /api/ in client calls) ---

// FIX: Use `Request` and `Response` types from express to correctly access `req.body` and `res` methods.
app.post('/generate-content', async (req: Request, res: Response) => {
    try {
        const { model, prompt, systemInstruction } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
        
        const response = await ai.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: { systemInstruction },
        });
        res.json({ text: response.text });
    } catch (error) {
        handleApiError(res, error, 'generate content');
    }
});

// FIX: Use `Request` and `Response` types from express to correctly access `req.body` and `res` methods.
app.post('/generate-study-plan', async (req: Request, res: Response) => {
    try {
        const { goal, duration, level, model, systemInstruction } = req.body;
        if (!goal || !duration || !level) return res.status(400).json({ error: 'Goal, duration, and level are required.' });
        
        const prompt = `Create a structured, day-by-day study plan for a user with the following details:
        - Goal: "${goal}"
        - Duration: ${duration}
        - Current Level: ${level}

        The output must be a JSON object with this exact structure: { "plan_title": string, "duration_days": number, "daily_plan": [{ "day": number, "topic": string, "tasks": string[], "estimated_time": string }] }.
        The plan should be practical, breaking down the goal into manageable daily tasks.
        Provide the response ONLY in the requested JSON format.`;
        
        const response = await ai.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: { systemInstruction, responseMimeType: 'application/json' }
        });
        res.json(JSON.parse(response.text));
    } catch (error) {
        handleApiError(res, error, 'generate study plan');
    }
});

// FIX: Use `Request` and `Response` types from express to correctly access `req.body` and `res` methods.
app.post('/convert-to-jawi', async (req: Request, res: Response) => {
    try {
        const { rumiText, model, systemInstruction } = req.body;
        if (!rumiText) return res.status(400).json({ error: 'Rumi text is required.' });
        
        const prompt = `Convert the following Rumi text to Jawi script. Provide only the Jawi text as a raw string, without any additional explanation or formatting.
        Rumi Text: "${rumiText}"`;
        
        const response = await ai.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: { systemInstruction }
        });
        res.json({ jawi: response.text.trim() });
    } catch (error) {
        handleApiError(res, error, 'convert to Jawi');
    }
});

// FIX: Use `Request` and `Response` types from express to correctly access `req.body` and `res` methods.
app.post('/generate-speech', async (req: Request, res: Response) => {
    try {
        const { text, voice } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required.' });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || 'Zephyr' } } }
            }
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            res.json({ audioData: base64Audio });
        } else {
            throw new Error("No audio data received from API.");
        }
    } catch (error) {
        handleApiError(res, error, 'generate speech');
    }
});

// FIX: Use `Request` and `Response` types from express to correctly access `req.body` and `res` methods.
app.post('/tajweed-feedback', async (req: Request, res: Response) => {
    try {
        const { originalText, userTranscript, model, systemInstruction } = req.body;
        if (!originalText || !userTranscript) return res.status(400).json({ error: 'Original text and user transcript are required.' });
        
        const prompt = `You are a Tajweed evaluation expert for Quranic Arabic. Analyze the user's recitation transcript against the original Arabic text.
            Original Text: "${originalText}"
            User's Transcript: "${userTranscript}"
            Provide your response as a JSON object with the following structure:
            { "accuracy": number, "feedback": string, "improvements": string[] }`;
            
        const response = await ai.models.generateContent({
            model: model || 'gemini-2.5-pro',
            contents: [{ parts: [{ text: prompt }] }],
            config: { systemInstruction, responseMimeType: 'application/json' }
        });
        res.json(JSON.parse(response.text));
    } catch (error) {
        handleApiError(res, error, 'get tajweed feedback');
    }
});

app.post('/edit-image', async (req: Request, res: Response) => {
    try {
        const { imageData, mimeType, prompt } = req.body;
        if (!imageData || !mimeType || !prompt) {
            return res.status(400).json({ error: 'imageData, mimeType, and prompt are required.' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // The model returns the new image in the first part of the first candidate
        const editedImagePart = response.candidates?.[0]?.content?.parts?.[0];

        if (editedImagePart && 'inlineData' in editedImagePart && editedImagePart.inlineData) {
            const base64ImageBytes: string = editedImagePart.inlineData.data;
            res.json({ imageData: base64ImageBytes });
        } else {
            throw new Error('No image data received from the AI model.');
        }

    } catch (error) {
        handleApiError(res, error, 'edit image');
    }
});

// FIX: Use `Request` and `Response` types from express to correctly access `req.body` and `res` methods.
app.post('/create-payment', async (req: Request, res: Response) => {
    try {
        const { packId, priceString } = req.body;
        if (!packId || !priceString) return res.status(400).json({ error: 'Pack ID and price are required.' });
        
        console.log(`[SERVER] Simulating payment creation for pack '${packId}' with price ${priceString}.`);
        const mockPaymentUrl = `https://chip-in.asia/pay/mock-session-${Date.now()}`;
        
        setTimeout(() => {
            res.json({
                success: true,
                message: 'Payment session created successfully.',
                paymentUrl: mockPaymentUrl,
            });
        }, 1000);
    } catch (error) {
        handleApiError(res, error, 'create payment session');
    }
});

// Vercel exports the Express app as a serverless function
export default app;