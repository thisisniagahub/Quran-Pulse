import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DOA_COUNTS_STORAGE_KEY = 'quranPulseDoaCounts';

interface DoaTrackerContextType {
  counts: { [key: string]: number };
  incrementCount: (title: string, target: number) => void;
  decrementCount: (title: string) => void;
  resetCount: (title: string) => void;
}

const DoaTrackerContext = createContext<DoaTrackerContextType | undefined>(undefined);

export const DoaTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCounts = localStorage.getItem(DOA_COUNTS_STORAGE_KEY);
      if (savedCounts) {
        setCounts(JSON.parse(savedCounts));
      }
    } catch (error) {
      console.error("Failed to load doa counts from localStorage", error);
    }
  }, []);

  // Save to localStorage whenever counts change
  useEffect(() => {
    try {
      localStorage.setItem(DOA_COUNTS_STORAGE_KEY, JSON.stringify(counts));
    } catch (error) {
      console.error("Failed to save doa counts to localStorage", error);
    }
  }, [counts]);

  const updateCount = useCallback((title: string, newCount: number) => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [title]: newCount
    }));
  }, []);

  const incrementCount = useCallback((title: string, target: number) => {
      const currentCount = counts[title] || 0;
      if (currentCount < target) {
          updateCount(title, currentCount + 1);
      }
  }, [counts, updateCount]);

  const decrementCount = useCallback((title: string) => {
      const currentCount = counts[title] || 0;
      updateCount(title, Math.max(0, currentCount - 1));
  }, [counts, updateCount]);

  const resetCount = useCallback((title: string) => {
      updateCount(title, 0);
  }, [updateCount]);

  const value = { counts, incrementCount, decrementCount, resetCount };

  return (
    <DoaTrackerContext.Provider value={value}>
      {children}
    </DoaTrackerContext.Provider>
  );
};

export const useDoaTracker = (): DoaTrackerContextType => {
  const context = useContext(DoaTrackerContext);
  if (context === undefined) {
    throw new Error('useDoaTracker must be used within a DoaTrackerProvider');
  }
  return context;
};