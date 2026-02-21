import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Save, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../types';
import { BinderSlot } from '../components/BinderSlot';
import { DraggableCard } from '../components/DraggableCard';
import Footer from '../components/Footer';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import AuthenticatedTabs from '../components/AuthenticatedTabs';

export default function BinderEditor() {
  const { id } = useParams<{ id: string }>();
  const { binders, cards } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const binder = binders.getBinder(id!);

  if (!binder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <CardUI className="p-8 text-center">
          <p className="text-slate-300 mb-4">Binder not found</p>
          <Button onClick={() => navigate('/binders')}>Go Back</Button>
        </CardUI>
      </div>
    );
  }

  const handleDropCard = (cardId: string, row: number, col: number) => {
    const newSlots = binder.slots.map(r => [...r]);
    newSlots[row][col] = cardId;
    binders.updateBinder(binder._id, { slots: newSlots });
    toast.success('Card placed in slot');
  };

  const handleRemoveCard = (row: number, col: number) => {
    const newSlots = binder.slots.map(r => [...r]);
    newSlots[row][col] = null;
    binders.updateBinder(binder._id, { slots: newSlots });
    toast.success('Card removed from slot');
  };

  const usedCardIds = new Set(binder.slots.flat().filter(id => id !== null));
  const availableCards = cards.cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.set.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filledSlots = binder.slots.flat().filter(slot => slot !== null).length;
  const totalSlots = binder.rows * binder.columns;
  const percentage = Math.round((filledSlots / totalSlots) * 100);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <AuthenticatedNavbar />
        <AuthenticatedTabs />

        {/* Header */}
        <header className="sticky top-24 z-10 bg-slate-800/95 border-b border-slate-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/binders')}
                className="text-slate-200 hover:bg-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {binder.name}
                </h1>
                <p className="text-sm text-slate-300">
                  {binder.rows}x{binder.columns} layout • {filledSlots}/{totalSlots} slots filled ({percentage}%)
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Binder Grid */}
            <div className="lg:col-span-2">
              <CardUI className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Binder Layout</h2>
                <div 
                  className="grid gap-2 sm:gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${binder.columns}, minmax(0, 1fr))`
                  }}
                >
                  {binder.slots.map((row, rowIdx) =>
                    row.map((cardId, colIdx) => {
                      const card = cardId ? cards.getCard(cardId) : null;
                      return (
                        <BinderSlot
                          key={`${rowIdx}-${colIdx}`}
                          row={rowIdx}
                          col={colIdx}
                          card={card}
                          onDrop={handleDropCard}
                          onRemove={() => handleRemoveCard(rowIdx, colIdx)}
                        />
                      );
                    })
                  )}
                </div>
              </CardUI>
            </div>

            {/* Card Collection */}
            <div className="lg:col-span-1">
              <CardUI className="p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Card Collection</h2>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {availableCards.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No cards found
                    </p>
                  ) : (
                    availableCards.map((card) => (
                      <DraggableCard
                        key={card._id}
                        card={card}
                        isUsed={usedCardIds.has(card._id)}
                      />
                    ))
                  )}
                </div>
              </CardUI>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </DndProvider>
  );
}
