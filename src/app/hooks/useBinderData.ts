import { useState, useEffect } from 'react';
import { Binder } from '../types';

const STORAGE_KEY = 'cardvault_binders';

export function useBinderData() {
  const [binders, setBinders] = useState<Binder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load binders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBinders(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading binders:', error);
        setBinders([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Save binders to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(binders));
    }
  }, [binders, isLoading]);

  const addBinder = (binder: Omit<Binder, '_id' | 'created_at'>) => {
    const newBinder: Binder = {
      ...binder,
      _id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setBinders(prev => [...prev, newBinder]);
    return newBinder;
  };

  const updateBinder = (id: string, updates: Partial<Binder>) => {
    setBinders(prev => prev.map(binder => 
      binder._id === id ? { ...binder, ...updates } : binder
    ));
  };

  const deleteBinder = (id: string) => {
    setBinders(prev => prev.filter(binder => binder._id !== id));
  };

  const getBinder = (id: string) => {
    return binders.find(binder => binder._id === id);
  };

  return {
    binders,
    isLoading,
    addBinder,
    updateBinder,
    deleteBinder,
    getBinder
  };
}
