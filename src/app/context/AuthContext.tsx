import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Validate input
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Simulate API call - in production, this would be a real API request
    // For now, we'll just validate from localStorage (stored during signup)
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find((u: { username: string; password: string }) => 
      u.username === username && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid username or password');
    }

    const newUser: User = {
      id: foundUser.id,
      username: foundUser.username,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signup = async (username: string, password: string) => {
    // Validate input
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.some((u: { username: string }) => u.username === username)) {
      throw new Error('Username already exists');
    }

    // Create new user
    const newUserId = Date.now().toString();
    const newUser: User = {
      id: newUserId,
      username,
    };

    // Store user credentials (in production, hash password and store on backend)
    storedUsers.push({
      id: newUserId,
      username,
      password, // WARNING: Never store plaintext passwords in production!
    });
    localStorage.setItem('users', JSON.stringify(storedUsers));

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
