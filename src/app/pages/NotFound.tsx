import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card as CardUI } from '../components/ui/card';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <CardUI className="p-8 sm:p-12 text-center max-w-md">
        <div className="text-6xl sm:text-8xl font-bold text-gray-300 dark:text-gray-700 mb-4">
          404
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')} className="w-full sm:w-auto">
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      </CardUI>
    </div>
  );
}
