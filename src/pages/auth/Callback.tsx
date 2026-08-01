import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error || loading || !isAuthenticated) return;
    navigate('/dashboard/guilds', { replace: true });
  }, [error, isAuthenticated, loading, navigate]);

  return <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
    {error ? <div role="alert" className="bg-error/10 border border-error/50 rounded-2xl p-8 max-w-md mx-4"><AlertCircle className="w-6 h-6 text-error mb-4" /><h2 className="text-2xl font-bold mb-2">Authentication failed</h2><p className="text-dark-300 mb-6">{error}</p><button onClick={() => navigate('/login')} className="btn-primary w-full">Try Again</button></div> : <motion.div className="text-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Loader2 className="w-12 h-12 text-neon-green" /></motion.div>}
  </div>;
}
