import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Plus, Grid3x3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import Footer from '../components/Footer';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import AuthenticatedTabs from '../components/AuthenticatedTabs';

export default function BinderPlanner() {
  const { binders, cards } = useData();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBinderName, setNewBinderName] = useState('');
  const [newBinderLayout, setNewBinderLayout] = useState<'3x3' | '4x4' | '5x5'>('3x3');

  const handleCreateBinder = () => {
    if (!newBinderName.trim()) {
      toast.error('Please enter a binder name');
      return;
    }

    const dimensions = {
      '3x3': { rows: 3, columns: 3 },
      '4x4': { rows: 4, columns: 4 },
      '5x5': { rows: 5, columns: 5 }
    }[newBinderLayout];

    const slots = Array(dimensions.rows).fill(null).map(() => Array(dimensions.columns).fill(null));

    const newBinder = binders.addBinder({
      name: newBinderName,
      rows: dimensions.rows,
      columns: dimensions.columns,
      slots
    });

    toast.success('Binder created successfully');
    setNewBinderName('');
    setIsDialogOpen(false);
    navigate(`/binder/${newBinder._id}`);
  };

  const handleDeleteBinder = (id: string, name: string) => {
    binders.deleteBinder(id);
    toast.success(`"${name}" deleted`);
  };

  const getBinderStats = (binderId: string) => {
    const binder = binders.getBinder(binderId);
    if (!binder) return { filled: 0, total: 0, percentage: 0 };

    const total = binder.rows * binder.columns;
    const filled = binder.slots.flat().filter(slot => slot !== null).length;
    const percentage = Math.round((filled / total) * 100);

    return { filled, total, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <AuthenticatedNavbar />
      <AuthenticatedTabs />

      {/* Header */}
      <header className="sticky top-24 z-10 bg-slate-800/95 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Binder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Binder</DialogTitle>
                  <DialogDescription>
                    Choose a name and layout for your binder
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="binder-name">Binder Name</Label>
                    <Input
                      id="binder-name"
                      value={newBinderName}
                      onChange={(e) => setNewBinderName(e.target.value)}
                      placeholder="e.g., Base Set Master"
                    />
                  </div>
                  <div>
                    <Label htmlFor="layout">Layout</Label>
                    <Select value={newBinderLayout} onValueChange={(value: any) => setNewBinderLayout(value)}>
                      <SelectTrigger id="layout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3x3">3x3 (9 slots)</SelectItem>
                        <SelectItem value="4x4">4x4 (16 slots)</SelectItem>
                        <SelectItem value="5x5">5x5 (25 slots)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBinder}>Create Binder</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {binders.binders.length === 0 ? (
          <CardUI className="p-12 text-center bg-slate-800 border border-slate-700">
            <Grid3x3 className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-300 mb-4">
              No binders yet. Create your first binder to organize your cards!
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Binder
            </Button>
          </CardUI>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {binders.binders.map((binder) => {
              const stats = getBinderStats(binder._id);
              return (
                <CardUI
                  key={binder._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow bg-slate-800 border border-slate-700"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {binder.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {binder.rows}x{binder.columns} layout
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-slate-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Binder?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{binder.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteBinder(binder._id, binder.name)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Mini Preview Grid */}
                    <div className="mb-4">
                      <div 
                        className="grid gap-1 bg-slate-700 p-3 rounded-lg"
                        style={{
                          gridTemplateColumns: `repeat(${binder.columns}, minmax(0, 1fr))`
                        }}
                      >
                        {binder.slots.flat().map((slot, idx) => (
                          <div
                            key={idx}
                            className={`aspect-[2.5/3.5] rounded ${
                              slot 
                                ? 'bg-gradient-to-br from-blue-400 to-purple-400' 
                                : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Completion</span>
                        <span className="font-medium text-white">
                          {stats.filled}/{stats.total} ({stats.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/binder/${binder._id}`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Open Binder
                    </Button>
                  </div>
                </CardUI>
              );
            })}
          </div>
        )}
      </main>      <Footer />    </div>
  );
}
