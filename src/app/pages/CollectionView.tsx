import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Search, Filter, Grid3x3, SortAsc, Trash2 } from 'lucide-react';
import { Card } from '../types';
import { toast } from 'sonner';
import Footer from '../components/Footer';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import AuthenticatedTabs from '../components/AuthenticatedTabs';

export default function CollectionView() {
  const { cards } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGraded, setFilterGraded] = useState<'all' | 'graded' | 'raw'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'value' | 'name'>('newest');
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  // Filter and sort cards
  let filteredCards = cards.cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.set.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGraded = filterGraded === 'all' ||
                         (filterGraded === 'graded' && card.is_graded) ||
                         (filterGraded === 'raw' && !card.is_graded);
    return matchesSearch && matchesGraded;
  });

  // Sort cards
  filteredCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'value') {
      return (b.estimated_value || 0) - (a.estimated_value || 0);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const toggleCardSelection = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const selectAllCards = () => {
    if (selectedCards.size === filteredCards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(filteredCards.map(card => card._id)));
    }
  };

  const deleteSelectedCards = () => {
    if (selectedCards.size === 0) return;
    
    selectedCards.forEach(cardId => {
      cards.deleteCard(cardId);
    });
    
    toast.success(`Deleted ${selectedCards.size} card(s)`);
    setSelectedCards(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <AuthenticatedNavbar />
      <AuthenticatedTabs />

      {/* Header */}
      <header className="sticky top-24 z-10 bg-slate-800/95 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-300" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            
            <Select value={filterGraded} onValueChange={(value: any) => setFilterGraded(value)}>
              <SelectTrigger className="w-auto bg-slate-700 border-slate-600 text-white p-2" title="Filter">
                <Filter className="w-5 h-5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cards</SelectItem>
                <SelectItem value="graded">Graded Only</SelectItem>
                <SelectItem value="raw">Raw Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-auto bg-slate-700 border-slate-600 text-white p-2" title="Sort">
                <SortAsc className="w-5 h-5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="value">Highest Value</SelectItem>
                <SelectItem value="name">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-400">
            Showing {filteredCards.length} of {cards.cards.length} cards
            {selectedCards.size > 0 && (
              <span className="ml-4 text-purple-400 font-semibold">
                {selectedCards.size} selected
              </span>
            )}
          </div>
          {selectedCards.size > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={selectAllCards}
                className="text-slate-200 border-slate-600 hover:bg-slate-700"
              >
                {selectedCards.size === filteredCards.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteSelectedCards}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {filteredCards.length === 0 ? (
          <CardUI className="p-12 text-center bg-slate-800 border border-slate-700">
            <Grid3x3 className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-300 mb-4">
              {searchQuery || filterGraded !== 'all' ? 'No cards match your filters' : 'No cards in your collection yet'}
            </p>
            <Button onClick={() => navigate('/add')}>Add Your First Card</Button>
          </CardUI>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredCards.map((card) => {
              const isSelected = selectedCards.has(card._id);
              return (
                <div key={card._id} className="relative group">
                  <div className="absolute -top-3 -right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleCardSelection(card._id)}
                      className="w-5 h-5"
                    />
                  </div>
                  <CardUI
                    className={`cursor-pointer hover:shadow-xl transition-all hover:scale-105 overflow-hidden bg-slate-800 border-2 ${
                      isSelected ? 'border-purple-500' : 'border-slate-700'
                    }`}
                    onClick={() => !isSelected && navigate(`/card/${card._id}`)}
                  >
                    <div className="aspect-[2.5/3.5] bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center p-4 relative overflow-hidden">
                      {card.image_url ? (
                        <img 
                          src={card.image_url} 
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm text-center font-medium text-white">
                          {card.name}
                        </p>
                      )}
                      {card.quantity > 1 && (
                        <Badge className="absolute top-2 right-2 text-xs">
                          x{card.quantity}
                        </Badge>
                      )}
                    </div>
                    <div className="p-2 sm:p-3">
                      <p className="text-sm font-bold text-white truncate">{card.name}</p>
                      <p className="text-xs text-slate-400 truncate">{card.set} #{card.card_number}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-medium text-white">
                          {card.is_graded ? (
                            <Badge variant="secondary" className="text-xs">
                              {card.grading?.company} {card.grading?.grade}
                            </Badge>
                          ) : (
                            <span className="text-xs">{card.condition || 'Raw'}</span>
                          )}
                        </p>
                      </div>
                      {card.estimated_value && (
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">
                          ${card.estimated_value}
                        </p>
                      )}
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-2 py-1 bg-slate-700 border-slate-600 text-white">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardUI>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}