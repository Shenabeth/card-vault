import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut, Settings } from 'lucide-react';

export default function AuthenticatedNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">🃏</span>
            <span className="text-xl font-bold text-white">Card Vault</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              title="Settings"
              className="text-slate-200 hover:text-white hover:bg-slate-700"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
              className="text-slate-200 hover:text-white hover:bg-slate-700"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
