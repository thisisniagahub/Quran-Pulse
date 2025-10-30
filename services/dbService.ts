import type { ChatMessage, StudyPlan, JawiConversion, TajweedSession, IqraPage } from '../types';

const DB_NAME = 'QuranPulseDB';
const DB_VERSION = 1;
let db: IDBDatabase | null = null;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;

      if (!dbInstance.objectStoreNames.contains('chatMessages')) {
        dbInstance.createObjectStore('chatMessages', { keyPath: 'id', autoIncrement: true });
      }
       if (!dbInstance.objectStoreNames.contains('ustazChatMessages')) {
        dbInstance.createObjectStore('ustazChatMessages', { keyPath: 'id', autoIncrement: true });
      }
      if (!dbInstance.objectStoreNames.contains('ayahExplanations')) {
        dbInstance.createObjectStore('ayahExplanations', { keyPath: 'surahAyah' });
      }
      if (!dbInstance.objectStoreNames.contains('studyPlans')) {
        const store = dbInstance.createObjectStore('studyPlans', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!dbInstance.objectStoreNames.contains('jawiConversions')) {
         const store = dbInstance.createObjectStore('jawiConversions', { keyPath: 'id', autoIncrement: true });
         store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!dbInstance.objectStoreNames.contains('tajweedSessions')) {
        const store = dbInstance.createObjectStore('tajweedSessions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!dbInstance.objectStoreNames.contains('iqraCache')) {
        dbInstance.createObjectStore('iqraCache', { keyPath: 'id' });
      }
    };
  });
};

// Generic Add/Get Functions
const addData = <T>(storeName: string, data: T): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

const getAllData = <T>(storeName: string): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
    });
};

const getData = <T>(storeName: string, key: IDBValidKey): Promise<T | null> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve((request.result as T) || null);
        request.onerror = () => reject(request.error);
    });
}

const putData = <T>(storeName: string, data: T): Promise<IDBValidKey> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};


// Chat Messages
export const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    return addData('chatMessages', { ...message, timestamp: Date.now() });
};
export const getChatMessages = () => getAllData<ChatMessage>('chatMessages');

// Ustaz Chat Messages
export const addUstazChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    return addData('ustazChatMessages', { ...message, timestamp: Date.now() });
};
export const getUstazChatMessages = () => getAllData<ChatMessage>('ustazChatMessages');


// Ayah Explanations (as a cache)
export const addAyahExplanation = (surahAyah: string, explanation: string) => {
    return putData('ayahExplanations', { surahAyah, explanation, timestamp: Date.now() });
};
export const getAyahExplanation = async (surahAyah: string): Promise<string | null> => {
    const result = await getData<{ explanation: string }>('ayahExplanations', surahAyah);
    return result?.explanation || null;
};

// Study Plans
export const addStudyPlan = (plan: Omit<StudyPlan, 'id' | 'timestamp'>) => {
    return addData('studyPlans', { ...plan, timestamp: Date.now() });
};
export const getStudyPlans = () => getAllData<StudyPlan>('studyPlans');

// Jawi Conversions
export const addJawiConversion = (conversion: Omit<JawiConversion, 'id' | 'timestamp'>) => {
    return addData('jawiConversions', { ...conversion, timestamp: Date.now() });
};
export const getJawiConversions = () => getAllData<JawiConversion>('jawiConversions');

// Tajweed Sessions
export const addTajweedSession = (session: Omit<TajweedSession, 'id'| 'timestamp'>) => {
    return addData('tajweedSessions', { ...session, timestamp: Date.now() });
};
export const getTajweedSessions = () => getAllData<TajweedSession>('tajweedSessions');

// Iqra Data Cache
const IQRA_CACHE_KEY = 'iqra-data';

export const cacheIqraData = (data: IqraPage[]): Promise<IDBValidKey> => {
    return putData('iqraCache', { id: IQRA_CACHE_KEY, data, timestamp: Date.now() });
};

export const getCachedIqraData = async (): Promise<IqraPage[] | null> => {
    const result = await getData<{ data: IqraPage[] }>('iqraCache', IQRA_CACHE_KEY);
    // Optional: Add cache invalidation logic here (e.g., based on timestamp)
    return result?.data || null;
};