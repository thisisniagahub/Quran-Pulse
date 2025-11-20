
import { getCache, setCache } from './dbService';

type TafsirRingkasData = { [key: string]: string };

let tafsirData: TafsirRingkasData | null = null;
let dataPromise: Promise<TafsirRingkasData> | null = null;

const TAFSIR_CACHE_KEY = 'tafsirRingkasData';

const loadTafsirData = async (): Promise<TafsirRingkasData> => {
    // 1. Check cache first
    const cachedData = await getCache(TAFSIR_CACHE_KEY);
    if (cachedData) {
        tafsirData = cachedData;
        return tafsirData!;
    }

    // 2. If not in cache, fetch from network
    try {
        const response = await fetch('/data/tafsirRingkasData.json');
        if (!response.ok) {
            throw new Error('Network response was not ok for tafsir data.');
        }
        const data = await response.json();
        tafsirData = data;
        
        // 3. Store in cache for future use
        await setCache(TAFSIR_CACHE_KEY, data);
        
        return tafsirData!;
    } catch (error) {
        console.error("Failed to load tafsir ringkas data:", error);
        return { "error": "Gagal memuatkan data tafsir." }; // Return error object on failure
    }
};

/**
 * Gets the brief tafsir for a specific surah and ayah.
 * This function ensures the data is fetched and cached only once.
 * @param surah The surah number.
 * @param ayah The ayah number.
 * @returns The tafsir text or an appropriate message.
 */
export const getTafsirRingkas = async (surah: number, ayah: number): Promise<string> => {
    if (!tafsirData) {
        if (!dataPromise) {
            // If data is not loaded and not currently being fetched, start fetching.
            dataPromise = loadTafsirData();
        }
        // Wait for the fetch to complete.
        await dataPromise;
    }
    
    const key = `${surah}:${ayah}`;
    return tafsirData?.[key] || "Tafsiran ringkas untuk ayat ini tidak tersedia pada masa ini.";
};
