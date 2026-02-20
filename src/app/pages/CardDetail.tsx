import { useParams, useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Edit, Trash2, Award, Package, DollarSign, Calendar, Tag } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const { cards } = useData();
  const navigate = useNavigate();

  const card = cards.getCard(id!);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <CardUI className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Card not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </CardUI>
      </div>
    );
  }

  const handleDelete = () => {
    cards.deleteCard(card._id);
    toast.success('Card deleted successfully');
    navigate('/collection');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/collection')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Card Details
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/edit/${card._id}`)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Card?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{card.name}" from your collection. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card Image */}
          <CardUI className="overflow-hidden">
            <div className="aspect-[2.5/3.5] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-8 overflow-hidden">
              {card.image_url ? (
                <img 
                  src={card.image_url} 
                  alt={card.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                    {card.name}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {card.set}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    #{card.card_number}
                  </p>
                </div>
              )}
            </div>
          </CardUI>

          {/* Card Details */}
          <div className="space-y-4">
            {/* Basic Info */}
            <CardUI className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Set</p>
                    <p className="font-medium text-gray-900 dark:text-white">{card.set}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Card Number</p>
                    <p className="font-medium text-gray-900 dark:text-white">{card.card_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                    <p className="font-medium text-gray-900 dark:text-white">{card.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Added</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(card.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardUI>

            {/* Grading Info */}
            <CardUI className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Condition & Grading
              </h2>
              {card.is_graded ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <Badge className="mt-1">Graded</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                    <p className="font-medium text-gray-900 dark:text-white">{card.grading?.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.grading?.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Certification Number</p>
                    <p className="font-medium text-gray-900 dark:text-white font-mono">{card.grading?.cert_number}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Badge variant="secondary" className="mt-1">Raw</Badge>
                  {card.condition && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
                      <p className="font-medium text-gray-900 dark:text-white">{card.condition}</p>
                    </div>
                  )}
                </div>
              )}
            </CardUI>

            {/* Value Info */}
            <CardUI className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Value
              </h2>
              <div className="space-y-3">
                {card.purchase_price && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purchase Price</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${card.purchase_price.toLocaleString()}
                    </p>
                  </div>
                )}
                {card.estimated_value && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${card.estimated_value.toLocaleString()}
                    </p>
                  </div>
                )}
                {card.purchase_price && card.estimated_value && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gain/Loss</p>
                    <p className={`text-xl font-bold ${
                      card.estimated_value - card.purchase_price >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {card.estimated_value - card.purchase_price >= 0 ? '+' : ''}
                      ${(card.estimated_value - card.purchase_price).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardUI>

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <CardUI className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardUI>
            )}

            {/* Notes */}
            {card.notes && (
              <CardUI className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notes</h2>
                <p className="text-gray-700 dark:text-gray-300">{card.notes}</p>
              </CardUI>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}