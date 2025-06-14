import { useState, useCallback, useRef } from 'react';

interface CodeHistoryEntry {
  id: string;
  code: string;
  timestamp: number;
  description: string;
}

export const useCodeHistory = () => {
  const [history, setHistory] = useState<CodeHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lastSaveTime = useRef<number>(0);

  const saveToHistory = useCallback((code: string, description: string = '代码更新') => {
    const now = Date.now();
    
    // Avoid saving too frequently (minimum 5 seconds between saves)
    if (now - lastSaveTime.current < 5000) {
      return;
    }
    
    lastSaveTime.current = now;
    
    const newEntry: CodeHistoryEntry = {
      id: `entry_${now}`,
      code,
      timestamp: now,
      description
    };

    setHistory(prev => {
      // If we're not at the latest entry, remove entries after current index
      const newHistory = currentIndex >= 0 ? prev.slice(0, currentIndex + 1) : prev;
      
      // Add new entry
      const updatedHistory = [...newHistory, newEntry];
      
      // Keep only last 20 entries
      if (updatedHistory.length > 20) {
        return updatedHistory.slice(-20);
      }
      
      return updatedHistory;
    });

    setCurrentIndex(prev => {
      const newIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
      return Math.min(newIndex, 19); // Max index is 19 (for 20 entries)
    });
  }, [currentIndex]);

  const undoToVersion = useCallback((index: number): string | null => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      return history[index].code;
    }
    return null;
  }, [history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const undo = useCallback((): string | null => {
    if (canUndo) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex].code;
    }
    return null;
  }, [canUndo, currentIndex, history]);

  const redo = useCallback((): string | null => {
    if (canRedo) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex].code;
    }
    return null;
  }, [canRedo, currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const getFormattedHistory = useCallback(() => {
    return history.map((entry, index) => ({
      ...entry,
      isCurrent: index === currentIndex,
      relativeTime: getRelativeTime(entry.timestamp)
    }));
  }, [history, currentIndex]);

  return {
    saveToHistory,
    undoToVersion,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
    history: getFormattedHistory(),
    currentIndex
  };
};

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return `${Math.floor(diff / 86400000)}天前`;
}
