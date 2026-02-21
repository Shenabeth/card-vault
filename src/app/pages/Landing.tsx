import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-6xl font-bold">🃏</div>
          <h1 className="text-5xl font-bold text-white">Card Vault</h1>
          <p className="text-xl text-slate-300">
            Track, organize, and showcase your trading card collection
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 space-y-6 my-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-2xl">📚</span>
              <div className="text-left">
                <h3 className="font-semibold text-white">Collection Tracking</h3>
                <p className="text-sm text-slate-400">
                  Add, edit, and manage your entire card collection with detailed metadata
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl">🧩</span>
              <div className="text-left">
                <h3 className="font-semibold text-white">Binder Planner</h3>
                <p className="text-sm text-slate-400">
                  Drag and drop cards into custom binder layouts to plan your displays
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <h3 className="font-semibold text-white">Value Tracking</h3>
                <p className="text-sm text-slate-400">
                  Monitor your collection's estimated value and investment growth
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl">🏆</span>
              <div className="text-left">
                <h3 className="font-semibold text-white">Grading Support</h3>
                <p className="text-sm text-slate-400">
                  Track graded cards from PSA, BGS, CGC, and other companies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-8">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            size="lg"
            variant="outline"
            className="w-full border-slate-600 text-white hover:bg-slate-800"
          >
            Create Account
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-400 pt-8">
          Start organizing your collection today
        </p>
      </div>
    </div>
  );
}
