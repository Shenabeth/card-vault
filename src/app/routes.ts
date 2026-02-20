import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import CollectionView from './pages/CollectionView';
import CardDetail from './pages/CardDetail';
import AddEditCard from './pages/AddEditCard';
import BinderPlanner from './pages/BinderPlanner';
import BinderEditor from './pages/BinderEditor';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
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
    path: '*',
    Component: NotFound,
  },
]);