import type { ChatMessage, StudyPlan, TajweedSession, JawiConversion, IqraPracticeSession } from '../types';

// Define cache TTL (Time To Live) in milliseconds
const CACHE_TTL = {
  AYAH_EXPLANATIONS: 24 * 60 * 60 * 1000, // 24 hours
  AYAHS: 1 * 60 * 60 * 1000,              // 1 hour
  PRAYER_TIMES: 30 * 60 * 1000,            // 30 minutes
  CHAT_MESSAGES: 7 * 24 * 60 * 60 * 1000, // 7 days
  STUDY_PLANS: 30 * 24 * 60 * 60 * 1000,  // 30 days
  QIBLA_DATA: 10 * 60 * 1000,              // 10 minutes
  DEFAULT: 2 * 60 * 60 * 1000,             // 2 hours
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const DB_NAME = 'quranPulseDB';
const DB_VERSION = 5; // Version incremented to add TTL support

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('chatMessages')) {
                const store = db.createObjectStore('chatMessages', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('ustazChatMessages')) {
                const store = db.createObjectStore('ustazChatMessages', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('studyPlans')) {
                const store = db.createObjectStore('studyPlans', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('tajweedSessions')) {
                const store = db.createObjectStore('tajweedSessions', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('jawiConversions')) {
                const store = db.createObjectStore('jawiConversions', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            // New store for caching ayah explanations with TTL
            if (!db.objectStoreNames.contains('ayahExplanations')) {
                db.createObjectStore('ayahExplanations', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('iqraPracticeHistory')) {
                const store = db.createObjectStore('iqraPracticeHistory', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            // Generic cache store with TTL support
            if (!db.objectStoreNames.contains('appCache')) {
                db.createObjectStore('appCache', { keyPath: 'key' });
            }
            // System cache for general purpose caching with TTL
            if (!db.objectStoreNames.contains('systemCache')) {
                db.createObjectStore('systemCache', { keyPath: 'key' });
            }
        };
    });
};

const performDBAction = async <T>(storeName: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest): Promise<T> => {
    const db = await openDB();
    return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = action(store);
        
        transaction.oncomplete = () => {};
        
        transaction.onerror = () => {
            console.error('Transaction error:', transaction.error);
            reject(transaction.error);
        };
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Request error:', request.error);
            reject(request.error);
        };
    });
};

// Add with TTL support
const addWithTTL = <T>(storeName: string, key: string, data: T, ttl: number = CACHE_TTL.DEFAULT) => {
    const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
    };
    return performDBAction(storeName, 'readwrite', store => store.put(cacheEntry));
};

// Get with TTL validation
const getWithTTL = async <T>(storeName: string, key: string, ttl: number = CACHE_TTL.DEFAULT): Promise<T | null> => {
    const cacheEntry = await performDBAction<CacheEntry<T>>(storeName, 'readonly', store => store.get(key));
    
    if (cacheEntry) {
        const now = Date.now();
        // Check if the entry is still valid based on TTL
        if (now - cacheEntry.timestamp <= cacheEntry.ttl) {
            return cacheEntry.data;
        } else {
            // Entry is expired, remove it
            await performDBAction(storeName, 'readwrite', store => store.delete(key));
            return null;
        }
    }
    return null;
};

// Clean expired entries from a store
const cleanExpiredEntries = async (storeName: string) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const request = store.getAll();
        
        return new Promise<void>((resolve, reject) => {
            request.onsuccess = () => {
                const now = Date.now();
                const expiredKeys: string[] = [];
                
                // Find expired entries
                const allEntries = request.result as CacheEntry<any>[];
                allEntries.forEach((entry: any) => {
                    if (typeof entry === 'object' && entry.timestamp && entry.ttl) {
                        if (now - entry.timestamp > entry.ttl) {
                            expiredKeys.push(entry.key || entry.id);
                        }
                    }
                });
                
                // Delete expired entries
                expiredKeys.forEach(key => {
                    store.delete(key);
                });
                
                resolve();
            };
            
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Error cleaning expired entries:', error);
    }
};

// Clean expired entries periodically (e.g., daily)
const scheduleTTLCleanup = () => {
    // Clean expired entries every hour
    setInterval(() => {
        cleanExpiredEntries('appCache');
        cleanExpiredEntries('ayahExplanations');
        cleanExpiredEntries('systemCache');
    }, 60 * 60 * 1000); // 1 hour
};

// Start TTL cleanup if not already started
if (typeof window !== 'undefined') {
    scheduleTTLCleanup();
}

const add = (storeName: string, data: any) => performDBAction(storeName, 'readwrite', store => store.add({ ...data, timestamp: Date.now() }));

// Get paginated results with cursor-based pagination
const getPaginated = async <T>(storeName: string, limit: number, lastKey?: number): Promise<{ results: T[], lastKey: number | null }> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index('timestamp');
        
        const request = lastKey 
            ? index.openCursor(IDBKeyRange.lowerBound(lastKey, true)) 
            : index.openCursor(null, 'prev'); // Get in reverse chronological order
        
        const results: T[] = [];
        let lastResultKey: number | null = null;
        
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
            if (cursor && results.length < limit) {
                results.push({ ...cursor.value, id: cursor.key } as T);
                lastResultKey = cursor.key as number;
                cursor.continue();
            } else {
                resolve({ results, lastKey: lastResultKey });
            }
        };
        
        request.onerror = () => {
            console.error('Request error:', request.error);
            reject(request.error);
        };
    });
};

const getAll = <T>(storeName: string): Promise<T[]> => performDBAction<T[]>(storeName, 'readonly', store => store.getAll());
const put = (storeName: string, data: any) => performDBAction(storeName, 'readwrite', store => store.put({ ...data, timestamp: Date.now() }));
const get = <T>(storeName: string, key: string): Promise<T> => performDBAction<T>(storeName, 'readonly', store => store.get(key));

// --- Chat Messages (AI Companion) ---
export const addChatMessage = (message: Omit<ChatMessage, 'id'>) => add('chatMessages', message);
export const getChatMessages = (): Promise<ChatMessage[]> => getAll<ChatMessage>('chatMessages');
export const getChatMessagesPaginated = (limit: number, lastKey?: number): Promise<{ results: ChatMessage[], lastKey: number | null }> => 
    getPaginated<ChatMessage>('chatMessages', limit, lastKey);

// --- Chat Messages (Tanya Ustaz) ---
export const addUstazChatMessage = (message: Omit<ChatMessage, 'id'>) => add('ustazChatMessages', message);
export const getUstazChatMessages = (): Promise<ChatMessage[]> => getAll<ChatMessage>('ustazChatMessages');
export const getUstazChatMessagesPaginated = (limit: number, lastKey?: number): Promise<{ results: ChatMessage[], lastKey: number | null }> => 
    getPaginated<ChatMessage>('ustazChatMessages', limit, lastKey);

// --- Study Plans ---
export const addStudyPlan = (plan: StudyPlan) => add('studyPlans', plan);
export const getStudyPlans = (): Promise<StudyPlan[]> => getAll<StudyPlan>('studyPlans');
export const getStudyPlansPaginated = (limit: number, lastKey?: number): Promise<{ results: StudyPlan[], lastKey: number | null }> => 
    getPaginated<StudyPlan>('studyPlans', limit, lastKey);

// --- Tajweed Sessions ---
export const addTajweedSession = (session: Omit<TajweedSession, 'id' | 'timestamp'>) => add('tajweedSessions', session);
export const getTajweedSessions = (): Promise<TajweedSession[]> => getAll<TajweedSession>('tajweedSessions');
export const getTajweedSessionsPaginated = (limit: number, lastKey?: number): Promise<{ results: TajweedSession[], lastKey: number | null }> => 
    getPaginated<TajweedSession>('tajweedSessions', limit, lastKey);

// --- Jawi Conversions ---
export const addJawiConversion = (conversion: Omit<JawiConversion, 'id' | 'timestamp'>) => add('jawiConversions', conversion);
export const getJawiConversions = (): Promise<JawiConversion[]> => getAll<JawiConversion>('jawiConversions');
export const getJawiConversionsPaginated = (limit: number, lastKey?: number): Promise<{ results: JawiConversion[], lastKey: number | null }> => 
    getPaginated<JawiConversion>('jawiConversions', limit, lastKey);

// --- Ayah Explanations (Caching with TTL) ---
export const addAyahExplanation = (id: string, text: string) => 
    addWithTTL('ayahExplanations', id, text, CACHE_TTL.AYAH_EXPLANATIONS);
export const getAyahExplanation = async (id: string): Promise<string | null> => {
    return getWithTTL('ayahExplanations', id, CACHE_TTL.AYAH_EXPLANATIONS);
};

// --- Iqra' Practice Sessions ---
export const addIqraPracticeSession = (session: Omit<IqraPracticeSession, 'id' | 'timestamp'>) => add('iqraPracticeHistory', session);
export const getIqraPracticeHistory = (): Promise<IqraPracticeSession[]> => getAll<IqraPracticeSession>('iqraPracticeHistory');
export const getIqraPracticeHistoryPaginated = (limit: number, lastKey?: number): Promise<{ results: IqraPracticeSession[], lastKey: number | null }> => 
    getPaginated<IqraPracticeSession>('iqraPracticeHistory', limit, lastKey);

// --- Generic App Cache with TTL ---
export const setCache = (key: string, value: any, ttl: number = CACHE_TTL.DEFAULT) => 
    addWithTTL('appCache', key, value, ttl);
export const getCache = async (key: string, ttl: number = CACHE_TTL.DEFAULT): Promise<any | null> => {
    return getWithTTL('appCache', key, ttl);
};

// --- System Cache with TTL for general purpose caching ---
export const setSystemCache = <T>(key: string, value: T, ttl: number = CACHE_TTL.DEFAULT) => 
    addWithTTL('systemCache', key, value, ttl);
export const getSystemCache = async <T>(key: string, ttl: number = CACHE_TTL.DEFAULT): Promise<T | null> => {
    return getWithTTL<T>('systemCache', key, ttl);
};

// --- Cache management utilities ---
export const clearExpiredCache = async () => {
    await cleanExpiredEntries('appCache');
    await cleanExpiredEntries('ayahExplanations');
    await cleanExpiredEntries('systemCache');
};

export const clearAllCache = async () => {
    const db = await openDB();
    const transaction = db.transaction(['appCache', 'ayahExplanations', 'systemCache'], 'readwrite');
    
    return Promise.all([
        transaction.objectStore('appCache').clear(),
        transaction.objectStore('ayahExplanations').clear(),
        transaction.objectStore('systemCache').clear()
    ]);
};

// TTL configuration constants for external use
export const TTL_CONFIG = CACHE_TTL;