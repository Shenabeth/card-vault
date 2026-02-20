import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Search, Filter, Grid3x3, SortAsc } from 'lucide-react';
import { Card } from '../types';

export default function CollectionView() {
  const { cards } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGraded, setFilterGraded] = useState<'all' | 'graded' | 'raw'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'value' | 'name'>('newest');

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Collection
            </h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterGraded} onValueChange={(value: any) => setFilterGraded(value)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cards</SelectItem>
                <SelectItem value="graded">Graded Only</SelectItem>
                <SelectItem value="raw">Raw Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue />
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
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCards.length} of {cards.cards.length} cards
        </div>

        {filteredCards.length === 0 ? (
          <CardUI className="p-12 text-center">
            <Grid3x3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || filterGraded !== 'all' ? 'No cards match your filters' : 'No cards in your collection yet'}
            </p>
            <Button onClick={() => navigate('/add')}>Add Your First Card</Button>
          </CardUI>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredCards.map((card) => (
              <CardUI
                key={card._id}
                className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 overflow-hidden"
                onClick={() => navigate(`/card/${card._id}`)}
              >
                <div className="aspect-[2.5/3.5] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
                  {card.image_url ? (
                    <img 
                      src={card.image_url} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-center font-medium text-gray-700 dark:text-gray-300">
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
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{card.set}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{card.card_number}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
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
                        <Badge key={idx} variant="outline" className="text-[10px] px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardUI>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}