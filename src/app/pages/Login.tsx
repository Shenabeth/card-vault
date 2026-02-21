import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🃏</div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-slate-400">Log in to your Card Vault account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold mt-6"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-sm text-slate-400">
          <p className="font-semibold text-white mb-2">Demo Credentials</p>
          <p className="mb-1">Create an account or use existing credentials</p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
