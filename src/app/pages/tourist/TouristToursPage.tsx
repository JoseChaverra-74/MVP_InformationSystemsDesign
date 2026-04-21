import { Navigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { ToursPublicPage } from '../ToursPublicPage';
import { useAuth } from '../../lib/auth';

export function TouristToursPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'Turista') {
    return <Navigate to="/login" replace />;
  }

  // Reuse the public tours page but with tourist navbar
  return <ToursPublicPage />;
}
