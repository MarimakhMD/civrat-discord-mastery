import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/** Keeps protected URLs inaccessible after a local or remote sign-out. */
export function RequireAuth() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-dark-900" aria-label="Chargement" />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
