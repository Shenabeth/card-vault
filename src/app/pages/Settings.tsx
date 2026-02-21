import { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import Footer from '../components/Footer';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar';
import AuthenticatedTabs from '../components/AuthenticatedTabs';

export default function Settings() {
  const { cards, binders } = useData();
  const [exportMessage, setExportMessage] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    try {
      const data = {
        cards: cards.cards,
        binders: binders.binders,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `card-vault-export-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportMessage('✓ Data exported successfully!');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage('✗ Error exporting data');
      setTimeout(() => setExportMessage(''), 3000);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate the data structure
        if (!data.cards || !Array.isArray(data.cards) || !data.binders || !Array.isArray(data.binders)) {
          throw new Error('Invalid file format');
        }

        // Store in localStorage for the app to process
        localStorage.setItem('card-vault-import', JSON.stringify(data));
        setImportMessage('✓ Data imported successfully! Please refresh the page.');
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setImportMessage('✗ Error importing data. Please check the file format.');
        setTimeout(() => setImportMessage(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <AuthenticatedNavbar />
      <AuthenticatedTabs />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Settings</h1>

        {/* Data Management Section */}
        <CardUI className="bg-slate-800 border border-slate-700 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Data Management</h2>
          <p className="text-slate-300 mb-6">
            Export your collection data as a backup or import data from a previous export.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Export Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Download your cards and binders as a JSON file for backup or migration.
                </p>
              </div>
              <Button
                onClick={handleExportData}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              {exportMessage && (
                <Alert className="bg-slate-700 border border-slate-600">
                  <AlertDescription className="text-white">{exportMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Import Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Import Data</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Upload a previously exported JSON file to restore your collection.
                </p>
              </div>
              <Button
                onClick={triggerFileInput}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 w-full sm:w-auto"
              >
                <Upload className="w-4 h-4" />
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              {importMessage && (
                <Alert className={`border ${importMessage.startsWith('✓') ? 'bg-slate-700 border-slate-600' : 'bg-red-900/30 border-red-700'}`}>
                  <AlertDescription className={importMessage.startsWith('✓') ? 'text-white' : 'text-red-200'}>
                    {importMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="mt-6 bg-amber-900/30 border border-amber-700">
            <AlertCircle className="w-4 h-4 text-amber-200" />
            <AlertDescription className="text-amber-100 ml-2">
              Importing data will merge with your existing collection. Make a backup first if you want to preserve your current data.
            </AlertDescription>
          </Alert>
        </CardUI>

        {/* About Section */}
        <CardUI className="bg-slate-800 border border-slate-700 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Card Vault</h2>
          <div className="space-y-3 text-slate-300">
            <p>
              <span className="text-white font-semibold">Version:</span> 1.0.0
            </p>
            <p>
              <span className="text-white font-semibold">Total Cards:</span> {cards.cards.length}
            </p>
            <p>
              <span className="text-white font-semibold">Total Binders:</span> {binders.binders.length}
            </p>
            <p className="pt-4">
              Card Vault is your personal trading card collection manager. Organize, track, and manage your valuable card collection all in one place.
            </p>
          </div>
        </CardUI>
      </main>

      <Footer />
    </div>
  );
}
