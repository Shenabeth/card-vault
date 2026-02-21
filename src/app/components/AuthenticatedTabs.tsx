import { useLocation, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Home, Grid3x3, Plus, Package } from 'lucide-react';

export default function AuthenticatedTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Collection', path: '/collection', icon: Package },
    { label: 'Binders', path: '/binders', icon: Grid3x3 },
    { label: 'Add Card', path: '/add', icon: Plus }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-16 z-40 bg-slate-800/95 border-b border-slate-700 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <Button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                variant="ghost"
                className={`flex items-center gap-2 px-4 py-3 rounded-none border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-b-purple-500 text-white hover:bg-slate-700'
                    : 'border-b-transparent text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
