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
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Card, GradingCompany, CardCondition, CardTag } from '../types';
import Footer from '../components/Footer';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import AuthenticatedTabs from '../components/AuthenticatedTabs';

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
    tags: [] as string[],
    image_url: ''
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
          tags: card.tags || [],
          image_url: card.image_url || ''
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData(prev => ({ ...prev, image_url: imageData }));
        toast.success('Image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageData = event.target?.result as string;
              setFormData(prev => ({ ...prev, image_url: imageData }));
              toast.success('Image pasted');
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <AuthenticatedNavbar />
      <AuthenticatedTabs />

      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8" onPaste={handlePaste}>
        <form onSubmit={handleSubmit}>
          <CardUI className="p-6 bg-slate-800 border border-slate-700">
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Card Image</h2>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="relative w-40 mx-auto">
                      <img 
                        src={formData.image_url} 
                        alt="Card preview" 
                        className="w-full rounded-lg border border-slate-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="mt-2 w-full"
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-600 transition-colors">
                        <Upload className="w-5 h-5 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-300">Click to upload or paste image</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-200 block mb-2">Card Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Charizard"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="set" className="text-slate-200 block mb-2">Set Name *</Label>
                      <Input
                        id="set"
                        value={formData.set}
                        onChange={(e) => setFormData(prev => ({ ...prev, set: e.target.value }))}
                        placeholder="e.g., Base Set"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="card_number" className="text-slate-200 block mb-2">Card Number *</Label>
                      <Input
                        id="card_number"
                        value={formData.card_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, card_number: e.target.value }))}
                        placeholder="e.g., 4/102"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-slate-200 block mb-2">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Grading */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Condition & Grading</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="is_graded" className="text-slate-200 block mb-2">Graded Card</Label>
                      <p className="text-sm text-slate-400">Is this card professionally graded?</p>
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
                          <Label htmlFor="grading_company" className="text-slate-200 block mb-2">Grading Company</Label>
                          <Select
                            value={formData.grading_company}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, grading_company: value as GradingCompany }))}
                          >
                            <SelectTrigger id="grading_company" className="bg-slate-700 border-slate-600 text-white">
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
                          <Label htmlFor="grading_grade" className="text-slate-200 block mb-2">Grade</Label>
                          <Input
                            id="grading_grade"
                            type="number"
                            step="0.5"
                            min="1"
                            max="10"
                            value={formData.grading_grade}
                            onChange={(e) => setFormData(prev => ({ ...prev, grading_grade: e.target.value }))}
                            placeholder="e.g., 9"
                            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="grading_cert" className="text-slate-200 block mb-2">Certification Number</Label>
                        <Input
                          id="grading_cert"
                          value={formData.grading_cert}
                          onChange={(e) => setFormData(prev => ({ ...prev, grading_cert: e.target.value }))}
                          placeholder="e.g., 12345678"
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="condition" className="text-slate-200 block mb-2">Condition</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value as CardCondition }))}
                      >
                        <SelectTrigger id="condition" className="bg-slate-700 border-slate-600 text-white">
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
                <h2 className="text-lg font-semibold text-white mb-4">Value</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchase_price" className="text-slate-200 block mb-2">Purchase Price ($)</Label>
                    <Input
                      id="purchase_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                      placeholder="0.00"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimated_value" className="text-slate-200 block mb-2">Estimated Value ($)</Label>
                    <Input
                      id="estimated_value"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.estimated_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_value: e.target.value }))}
                      placeholder="0.00"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {(['For Trade', 'For Sale', 'PC', 'Investment'] as CardTag[]).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className={formData.tags.includes(tag) ? '' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-slate-200 block mb-2">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this card..."
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
          </CardUI>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              onClick={() => navigate(isEditing ? `/card/${id}` : '/collection')}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              {isEditing ? 'Save Changes' : 'Save'}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
