import type { ChatMessage, StudyPlan, TajweedSession, JawiConversion, IqraPracticeSession } from '../types';

const DB_NAME = 'quranPulseDB';
const DB_VERSION = 3; // Version incremented for schema changes

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
                db.createObjectStore('chatMessages', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('ustazChatMessages')) {
                db.createObjectStore('ustazChatMessages', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('studyPlans')) {
                db.createObjectStore('studyPlans', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('tajweedSessions')) {
                db.createObjectStore('tajweedSessions', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('jawiConversions')) {
                db.createObjectStore('jawiConversions', { keyPath: 'id', autoIncrement: true });
            }
            // New store for caching ayah explanations
            if (!db.objectStoreNames.contains('ayahExplanations')) {
                db.createObjectStore('ayahExplanations', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('iqraPracticeHistory')) {
                db.createObjectStore('iqraPracticeHistory', { keyPath: 'id', autoIncrement: true });
            }
            // Generic cache store
            if (!db.objectStoreNames.contains('appCache')) {
                db.createObjectStore('appCache', { keyPath: 'key' });
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

const add = (storeName: string, data: any) => performDBAction(storeName, 'readwrite', store => store.add({ ...data, timestamp: Date.now() }));
const getAll = <T>(storeName: string): Promise<T[]> => performDBAction<T[]>(storeName, 'readonly', store => store.getAll());
const put = (storeName: string, data: any) => performDBAction(storeName, 'readwrite', store => store.put({ ...data, timestamp: Date.now() }));
const get = <T>(storeName: string, key: string): Promise<T> => performDBAction<T>(storeName, 'readonly', store => store.get(key));

// --- Chat Messages (AI Companion) ---
export const addChatMessage = (message: Omit<ChatMessage, 'id'>) => add('chatMessages', message);
export const getChatMessages = (): Promise<ChatMessage[]> => getAll<ChatMessage>('chatMessages');

// --- Chat Messages (Tanya Ustaz) ---
export const addUstazChatMessage = (message: Omit<ChatMessage, 'id'>) => add('ustazChatMessages', message);
export const getUstazChatMessages = (): Promise<ChatMessage[]> => getAll<ChatMessage>('ustazChatMessages');

// --- Study Plans ---
export const addStudyPlan = (plan: StudyPlan) => add('studyPlans', plan);
export const getStudyPlans = (): Promise<StudyPlan[]> => getAll<StudyPlan>('studyPlans');

// --- Tajweed Sessions ---
export const addTajweedSession = (session: Omit<TajweedSession, 'id' | 'timestamp'>) => add('tajweedSessions', session);
export const getTajweedSessions = (): Promise<TajweedSession[]> => getAll<TajweedSession>('tajweedSessions');

// --- Jawi Conversions ---
export const addJawiConversion = (conversion: Omit<JawiConversion, 'id' | 'timestamp'>) => add('jawiConversions', conversion);
export const getJawiConversions = (): Promise<JawiConversion[]> => getAll<JawiConversion>('jawiConversions');

// --- Ayah Explanations (Caching) ---
export const addAyahExplanation = (id: string, text: string) => put('ayahExplanations', { id, text });
export const getAyahExplanation = async (id: string): Promise<string | null> => {
    const record = await get<{id: string, text: string}>('ayahExplanations', id);
    return record ? record.text : null;
};

// --- Iqra' Practice Sessions ---
export const addIqraPracticeSession = (session: Omit<IqraPracticeSession, 'id' | 'timestamp'>) => add('iqraPracticeHistory', session);
export const getIqraPracticeHistory = (): Promise<IqraPracticeSession[]> => getAll<IqraPracticeSession>('iqraPracticeHistory');

// --- Generic App Cache ---
export const setCache = (key: string, value: any) => performDBAction('appCache', 'readwrite', store => store.put({ key, value }));
export const getCache = async (key: string): Promise<any | null> => {
    const record = await get<{key: string, value: any}>('appCache', key);
    return record ? record.value : null;
};