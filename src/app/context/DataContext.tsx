import { createContext, useContext, ReactNode } from 'react';
import { useCardData } from '../hooks/useCardData';
import { useBinderData } from '../hooks/useBinderData';

interface DataContextType {
  cards: ReturnType<typeof useCardData>;
  binders: ReturnType<typeof useBinderData>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const cards = useCardData();
  const binders = useBinderData();

  return (
    <DataContext.Provider value={{ cards, binders }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
