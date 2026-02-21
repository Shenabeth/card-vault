import { createBrowserRouter } from 'react-router';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CollectionView from './pages/CollectionView';
import CardDetail from './pages/CardDetail';
import AddEditCard from './pages/AddEditCard';
import BinderPlanner from './pages/BinderPlanner';
import BinderEditor from './pages/BinderEditor';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/collection',
    Component: CollectionView,
  },
  {
    path: '/card/:id',
    Component: CardDetail,
  },
  {
    path: '/add',
    Component: AddEditCard,
  },
  {
    path: '/edit/:id',
    Component: AddEditCard,
  },
  {
    path: '/binders',
    Component: BinderPlanner,
  },
  {
    path: '/binder/:id',
    Component: BinderEditor,
  },
  {
    path: '/settings',
    Component: Settings,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);