import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get('error');
    const code = searchParams.get('code');
    if (err) { setError(err); return; }
    if (!code) { navigate('/dashboard', { replace: true }); return; }
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
      {error ? (
        <div className="bg-error/10 border border-error/50 rounded-2xl p-8 max-w-md mx-4">
          <AlertCircle className="w-6 h-6 text-error mb-4" />
          <h2 className="text-2xl font-bold mb-2">Auth Failed</h2><p className="text-dark-300 mb-6">{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full mb-3">Try Again</button>
          <button onClick={() => navigate('/')} className="btn-secondary w-full">Back to Home</button>
        </div>
      ) : (
        <motion.div className="text-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-12 h-12 text-neon-green" />
        </motion.div>
      )}
    </div>
  );
}