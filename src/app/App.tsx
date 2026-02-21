import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
}
