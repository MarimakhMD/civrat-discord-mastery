import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const providerError = searchParams.get('error');
  const code = searchParams.get('code');

  useEffect(() => {
    if (providerError || !code) return;
    let active = true;
    supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
      if (!active) return;
      if (error) { setExchangeError(error.message); return; }
      if (import.meta.env.VITE_AUTH_DEBUG === 'true') {
        console.info('[CIVRAT auth] exchangeCodeForSession', {
          hasSession: Boolean(data.session), hasProviderToken: Boolean(data.session?.provider_token),
          providerTokenLength: data.session?.provider_token?.length ?? 0,
          hasProviderRefreshToken: Boolean(data.session?.provider_refresh_token),
          providerRefreshTokenLength: data.session?.provider_refresh_token?.length ?? 0,
          hasAccessToken: Boolean(data.session?.access_token), accessTokenLength: data.session?.access_token?.length ?? 0,
          userId: data.session?.user?.id ?? null, identities: data.session?.user?.identities?.map((identity) => identity.provider) ?? [],
          metadataKeys: Object.keys(data.session?.user?.user_metadata ?? {}),
        });
      }
    });
    return () => { active = false; };
  }, [code, providerError]);

  useEffect(() => { if (!providerError && !exchangeError && !loading && isAuthenticated) navigate('/dashboard/guilds', { replace: true }); }, [providerError, exchangeError, isAuthenticated, loading, navigate]);
  const error = providerError || exchangeError;
  return <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
    {error ? <div role="alert" className="bg-error/10 border border-error/50 rounded-2xl p-8 max-w-md mx-4"><AlertCircle className="w-6 h-6 text-error mb-4" /><h2 className="text-2xl font-bold mb-2">Authentication failed</h2><p className="text-dark-300 mb-6">{error}</p><button onClick={() => navigate('/login')} className="btn-primary w-full">Try Again</button></div> : <motion.div className="text-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Loader2 className="w-12 h-12 text-neon-green" /></motion.div>}
  </div>;
}
