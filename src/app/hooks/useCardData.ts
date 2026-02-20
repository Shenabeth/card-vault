import { useState, useEffect } from 'react';
import { Card } from '../types';

const STORAGE_KEY = 'cardvault_cards';

// Sample data for initial load
const SAMPLE_CARDS: Card[] = [
  {
    _id: '1',
    name: 'Charizard',
    set: 'Base Set',
    card_number: '4/102',
    image_url: 'https://images.unsplash.com/photo-1613771404738-65d22f979710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlbW9uJTIwdHJhZGluZyUyMGNhcmQlMjBjaGFyaXphcmR8ZW58MXx8fHwxNzcxNjI3ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    is_graded: true,
    grading: {
      company: 'PSA',
      grade: 9,
      cert_number: '12345678'
    },
    purchase_price: 250,
    estimated_value: 400,
    quantity: 1,
    notes: 'Bought at convention',
    tags: ['Investment', 'PC'],
    created_at: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Blastoise',
    set: 'Base Set',
    card_number: '2/102',
    image_url: 'https://images.unsplash.com/photo-1746572651436-7da5d437ebca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2FyZCUyMGdhbWUlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MTYwNTg4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    is_graded: false,
    condition: 'Near Mint',
    purchase_price: 150,
    estimated_value: 180,
    quantity: 1,
    notes: '',
    tags: ['For Trade'],
    created_at: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Venusaur',
    set: 'Base Set',
    card_number: '15/102',
    image_url: 'https://images.unsplash.com/photo-1703023689733-6a4281149189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlbW9uJTIwY2FyZHMlMjB2aW50YWdlfGVufDF8fHx8MTc3MTYyNzg5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    is_graded: true,
    grading: {
      company: 'BGS',
      grade: 8.5,
      cert_number: '87654321'
    },
    purchase_price: 120,
    estimated_value: 150,
    quantity: 1,
    notes: '',
    tags: ['PC'],
    created_at: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Pikachu',
    set: 'Jungle',
    card_number: '60/64',
    image_url: 'https://images.unsplash.com/photo-1683732063736-206f03d2be1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMGNhcmQlMjBnYW1lJTIwZGVja3xlbnwxfHx8fDE3NzE2Mjc4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    is_graded: false,
    condition: 'Mint',
    purchase_price: 50,
    estimated_value: 75,
    quantity: 2,
    notes: 'Have duplicates',
    tags: ['For Sale'],
    created_at: new Date().toISOString()
  }
];

export function useCardData() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cards from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCards(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading cards:', error);
        setCards(SAMPLE_CARDS);
      }
    } else {
      setCards(SAMPLE_CARDS);
    }
    setIsLoading(false);
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isLoading]);

  const addCard = (card: Omit<Card, '_id' | 'created_at'>) => {
    const newCard: Card = {
      ...card,
      _id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setCards(prev => [...prev, newCard]);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Card>) => {
    setCards(prev => prev.map(card => 
      card._id === id ? { ...card, ...updates } : card
    ));
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card._id !== id));
  };

  const getCard = (id: string) => {
    return cards.find(card => card._id === id);
  };

  return {
    cards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    getCard
  };
}