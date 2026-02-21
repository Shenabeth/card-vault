import { Link, useNavigate } from 'react-router';
import { Card } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Plus, TrendingUp, Grid3x3, Package, Award } from 'lucide-react';
import Footer from '../components/Footer';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import AuthenticatedTabs from '../components/AuthenticatedTabs';

export default function Dashboard() {
  const { cards, binders } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalCards = cards.cards.reduce((sum, card) => sum + card.quantity, 0);
  const totalGraded = cards.cards.filter(card => card.is_graded).reduce((sum, card) => sum + card.quantity, 0);
  const totalValue = cards.cards.reduce((sum, card) => (card.estimated_value || 0) * card.quantity, 0);
  const recentCards = [...cards.cards].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <AuthenticatedNavbar />
      <AuthenticatedTabs />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Show welcome screen if no cards */}
        {cards.cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <CardUI className="p-8 sm:p-12 text-center max-w-2xl bg-slate-800 border border-slate-700">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-900/50 rounded-full mb-4">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome to Card Vault!
                </h2>
                <p className="text-slate-300 mb-6">
                  Start building your trading card collection. Track values, organize cards in binders, and manage your entire portfolio in one place.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <Package className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Track Collection</h3>
                  <p className="text-sm text-slate-300">Add cards, track values, and monitor your portfolio</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <Grid3x3 className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Organize Binders</h3>
                  <p className="text-sm text-slate-300">Create custom binders and arrange cards visually</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Track Value</h3>
                  <p className="text-sm text-slate-300">Monitor purchase prices and estimated values</p>
                </div>
              </div>

              <Button size="lg" onClick={() => navigate('/add')} className="w-full sm:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Card
              </Button>
            </CardUI>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <CardUI className="p-4 sm:p-6 bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Cards</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{totalCards}</p>
                  </div>
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardUI>

              <CardUI className="p-4 sm:p-6 bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Graded Cards</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{totalGraded}</p>
                  </div>
                  <div className="bg-purple-900/50 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardUI>

              <CardUI className="p-4 sm:p-6 bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Value</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-900/50 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardUI>

              <CardUI className="p-4 sm:p-6 bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Binders</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
                      {binders.binders.length}
                    </p>
                  </div>
                  <div className="bg-orange-900/50 p-3 rounded-lg">
                    <Grid3x3 className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </CardUI>
            </div>

            {/* Recently Added */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recently Added</h2>
                <Button 
                  onClick={() => navigate('/collection')}
                  size="sm"
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  View All
                </Button>
              </div>
              
              {recentCards.length === 0 ? (
                <CardUI className="p-8 text-center bg-slate-800 border border-slate-700">
                  <p className="text-slate-400">No cards yet. Add your first card to get started!</p>
                </CardUI>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  {recentCards.map((card) => (
                    <CardUI
                      key={card._id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden bg-slate-800 border border-slate-700"
                      onClick={() => navigate(`/card/${card._id}`)}
                    >
                      <div className="aspect-[2.5/3.5] bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center p-4 overflow-hidden">
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
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-sm font-bold text-white truncate">{card.name}</p>
                        <p className="text-xs text-slate-400 truncate">{card.set} #{card.card_number}</p>
                      </div>
                    </CardUI>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}