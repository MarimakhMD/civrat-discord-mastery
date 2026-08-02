import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const TRANSIENT_PROVIDER_TOKEN = 'civrat_discord_provider_token';

function safeSessionLog(source: string, session: { provider_token?: string | null; provider_refresh_token?: string | null; access_token?: string | null; user?: { id?: string; identities?: Array<{ provider: string }>; user_metadata?: Record<string, unknown> } } | null) {
  if (import.meta.env.VITE_AUTH_DEBUG !== 'true') return;
  console.info(`[CIVRAT auth] ${source}`, {
    hasSession: Boolean(session), hasProviderToken: Boolean(session?.provider_token), providerTokenLength: session?.provider_token?.length ?? 0,
    hasProviderRefreshToken: Boolean(session?.provider_refresh_token), providerRefreshTokenLength: session?.provider_refresh_token?.length ?? 0,
    hasAccessToken: Boolean(session?.access_token), accessTokenLength: session?.access_token?.length ?? 0,
    userId: session?.user?.id ?? null, identities: session?.user?.identities?.map((identity) => identity.provider) ?? [],
    metadataKeys: Object.keys(session?.user?.user_metadata ?? {}),
  });
}

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const code = searchParams.get('code');
  const implicit = useMemo(() => new URLSearchParams(window.location.hash.replace(/^#/, '')), []);
  const providerError = searchParams.get('error') || implicit.get('error_description') || implicit.get('error');

  useEffect(() => {
    if (providerError) return;
    let active = true;
    async function completeOAuth() {
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        if (error) { setExchangeError(error.message); return; }
        if (data.session?.provider_token) sessionStorage.setItem(TRANSIENT_PROVIDER_TOKEN, data.session.provider_token);
        safeSessionLog('exchangeCodeForSession', data.session);
        return;
      }

      // Compatibility path for an existing Supabase implicit flow returning
      // /auth/callback#access_token=...&refresh_token=... .
      const accessToken = implicit.get('access_token');
      const refreshToken = implicit.get('refresh_token');
      if (!accessToken || !refreshToken) {
        setExchangeError('Missing OAuth callback credentials.');
        return;
      }
      const providerToken = implicit.get('provider_token');
      if (providerToken) sessionStorage.setItem(TRANSIENT_PROVIDER_TOKEN, providerToken);
      const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (!active) return;
      if (error) { setExchangeError(error.message); return; }
      safeSessionLog('setSession from implicit callback', { ...data.session, provider_token: providerToken });
      // Remove tokens from the browser URL immediately after Supabase stores
      // the session. Provider token stays transiently in sessionStorage only.
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    void completeOAuth();
    return () => { active = false; };
  }, [code, implicit, providerError]);

  useEffect(() => { if (!providerError && !exchangeError && !loading && isAuthenticated) navigate('/dashboard/guilds', { replace: true }); }, [providerError, exchangeError, isAuthenticated, loading, navigate]);
  const error = providerError || exchangeError;
  return <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
    {error ? <div role="alert" className="bg-error/10 border border-error/50 rounded-2xl p-8 max-w-md mx-4"><AlertCircle className="w-6 h-6 text-error mb-4" /><h2 className="text-2xl font-bold mb-2">Authentication failed</h2><p className="text-dark-300 mb-6">{error}</p><button onClick={() => navigate('/login')} className="btn-primary w-full">Try Again</button></div> : <motion.div className="text-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Loader2 className="w-12 h-12 text-neon-green" /></motion.div>}
  </div>;
}
