import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, DiplomaticCode } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('diplomatic_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('diplomatic_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((code: string, result: DiplomaticCode) => {
    setHistory(prev => {
      const newItem: HistoryItem = {
        code,
        result,
        timestamp: Date.now()
      };
      const filtered = prev.filter(item => item.code !== code);
      return [newItem, ...filtered].slice(0, 50);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
