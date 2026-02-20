import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Card, GradingCompany, CardCondition, CardTag } from '../types';

export default function AddEditCard() {
  const { id } = useParams<{ id: string }>();
  const { cards } = useData();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    set: '',
    card_number: '',
    is_graded: false,
    condition: 'Near Mint' as CardCondition,
    grading_company: 'PSA' as GradingCompany,
    grading_grade: '',
    grading_cert: '',
    purchase_price: '',
    estimated_value: '',
    quantity: '1',
    notes: '',
    tags: [] as string[]
  });

  useEffect(() => {
    if (isEditing) {
      const card = cards.getCard(id);
      if (card) {
        setFormData({
          name: card.name,
          set: card.set,
          card_number: card.card_number,
          is_graded: card.is_graded,
          condition: (card.condition || 'Near Mint') as CardCondition,
          grading_company: (card.grading?.company || 'PSA') as GradingCompany,
          grading_grade: card.grading?.grade?.toString() || '',
          grading_cert: card.grading?.cert_number || '',
          purchase_price: card.purchase_price?.toString() || '',
          estimated_value: card.estimated_value?.toString() || '',
          quantity: card.quantity.toString(),
          notes: card.notes || '',
          tags: card.tags || []
        });
      }
    }
  }, [isEditing, id, cards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.set || !formData.card_number) {
      toast.error('Please fill in all required fields');
      return;
    }

    const cardData: Omit<Card, '_id' | 'created_at'> = {
      name: formData.name,
      set: formData.set,
      card_number: formData.card_number,
      image_url: '',
      is_graded: formData.is_graded,
      quantity: parseInt(formData.quantity) || 1,
      notes: formData.notes,
      tags: formData.tags,
      ...(formData.is_graded ? {
        grading: {
          company: formData.grading_company,
          grade: parseFloat(formData.grading_grade) || 0,
          cert_number: formData.grading_cert
        }
      } : {
        condition: formData.condition
      }),
      ...(formData.purchase_price && { purchase_price: parseFloat(formData.purchase_price) }),
      ...(formData.estimated_value && { estimated_value: parseFloat(formData.estimated_value) })
    };

    if (isEditing) {
      cards.updateCard(id, cardData);
      toast.success('Card updated successfully');
      navigate(`/card/${id}`);
    } else {
      const newCard = cards.addCard(cardData);
      toast.success('Card added successfully');
      navigate(`/card/${newCard._id}`);
    }
  };

  const toggleTag = (tag: CardTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isEditing ? `/card/${id}` : '/collection')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Card' : 'Add Card'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit}>
          <CardUI className="p-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Card Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Charizard"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="set">Set Name *</Label>
                      <Input
                        id="set"
                        value={formData.set}
                        onChange={(e) => setFormData(prev => ({ ...prev, set: e.target.value }))}
                        placeholder="e.g., Base Set"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="card_number">Card Number *</Label>
                      <Input
                        id="card_number"
                        value={formData.card_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, card_number: e.target.value }))}
                        placeholder="e.g., 4/102"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Grading */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Condition & Grading</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_graded">Graded Card</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Is this card professionally graded?</p>
                    </div>
                    <Switch
                      id="is_graded"
                      checked={formData.is_graded}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_graded: checked }))}
                    />
                  </div>

                  {formData.is_graded ? (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-500">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="grading_company">Grading Company</Label>
                          <Select
                            value={formData.grading_company}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, grading_company: value as GradingCompany }))}
                          >
                            <SelectTrigger id="grading_company">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PSA">PSA</SelectItem>
                              <SelectItem value="BGS">BGS (Beckett)</SelectItem>
                              <SelectItem value="CGC">CGC</SelectItem>
                              <SelectItem value="SGC">SGC</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="grading_grade">Grade</Label>
                          <Input
                            id="grading_grade"
                            type="number"
                            step="0.5"
                            min="1"
                            max="10"
                            value={formData.grading_grade}
                            onChange={(e) => setFormData(prev => ({ ...prev, grading_grade: e.target.value }))}
                            placeholder="e.g., 9"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="grading_cert">Certification Number</Label>
                        <Input
                          id="grading_cert"
                          value={formData.grading_cert}
                          onChange={(e) => setFormData(prev => ({ ...prev, grading_cert: e.target.value }))}
                          placeholder="e.g., 12345678"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value as CardCondition }))}
                      >
                        <SelectTrigger id="condition">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mint">Mint</SelectItem>
                          <SelectItem value="Near Mint">Near Mint</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Value */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Value</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchase_price">Purchase Price ($)</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimated_value">Estimated Value ($)</Label>
                    <Input
                      id="estimated_value"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.estimated_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_value: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {(['For Trade', 'For Sale', 'PC', 'Investment'] as CardTag[]).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this card..."
                  rows={4}
                />
              </div>
            </div>
          </CardUI>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(isEditing ? `/card/${id}` : '/collection')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Add Card'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
