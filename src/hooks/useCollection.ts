import { useState, useEffect, useCallback, useRef } from 'react';
import { CollectionItem, DiplomaticCode } from '../types';

export function useCollection() {
  const [collection, setCollection] = useState<CollectionItem[]>(() => {
    const saved = localStorage.getItem('diplomatic_collection');
    return saved ? JSON.parse(saved) : [];
  });

  const collectionRef = useRef(collection);
  collectionRef.current = collection;

  useEffect(() => {
    localStorage.setItem('diplomatic_collection', JSON.stringify(collection));
  }, [collection]);

  const addToCollection = useCallback((code: string, result: DiplomaticCode) => {
    const existingItem = collectionRef.current.find(item => item.code === code);
    const isNew = !existingItem;
    
    setCollection(prev => {
      const now = Date.now();
      const newItem: CollectionItem = {
        code,
        result,
        firstSeen: existingItem ? existingItem.firstSeen : now,
        lastSeen: now,
        timestamp: null, // backwards compatibility
      };
      const filtered = prev.filter(item => item.code !== code);
      return [newItem, ...filtered];
    });
    return isNew;
  }, []);

  const clearCollection = useCallback(() => {
    setCollection([]);
  }, []);

  return { collection, addToCollection, clearCollection };
}
