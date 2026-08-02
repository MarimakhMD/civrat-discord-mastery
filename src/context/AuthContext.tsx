import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { User, Guild } from '@/types';
import { supabase } from '@/lib/supabase';
import { getDiscordGuildsFromBot } from '@/lib/bot-sync';

interface AuthState {
  user: User | null; guilds: Guild[]; guildsError: string | null; loading: boolean; isAuthenticated: boolean;
  login: () => Promise<void>; logout: () => Promise<void>; refreshGuilds: () => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);
const authDebug = import.meta.env.VITE_AUTH_DEBUG === 'true';
const TRANSIENT_PROVIDER_TOKEN = 'civrat_discord_provider_token';

function logSession(source: string, session: Session | null) {
  if (!authDebug) return;
  // Never log raw access/provider/refresh tokens to browser or production logs.
  console.info(`[CIVRAT auth] ${source}`, {
    hasSession: Boolean(session), hasProviderToken: Boolean(session?.provider_token),
    providerTokenLength: session?.provider_token?.length ?? 0,
    hasProviderRefreshToken: Boolean(session?.provider_refresh_token),
    providerRefreshTokenLength: session?.provider_refresh_token?.length ?? 0,
    hasAccessToken: Boolean(session?.access_token), accessTokenLength: session?.access_token?.length ?? 0,
    userId: session?.user?.id ?? null, identities: session?.user?.identities?.map((identity) => identity.provider) ?? [],
    metadataKeys: Object.keys(session?.user?.user_metadata ?? {}),
  });
}

function dashboardUser(session: Session): User {
  const meta = session.user.user_metadata || {};
  const discordIdentity = session.user.identities?.find((identity) => identity.provider === 'discord')?.identity_data || {};
  return { id: session.user.id, discord_id: String(meta.provider_id || meta.sub || meta.id || discordIdentity.provider_id || discordIdentity.sub || discordIdentity.id || ''), username: String(meta.full_name || meta.user_name || meta.name || 'Discord user'), discriminator: String(meta.discriminator || '0000'), avatar: meta.avatar_url || meta.avatar || null, email: session.user.email || null, created_at: session.user.created_at, is_premium: false, premium_expires_at: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [guildsError, setGuildsError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [discordProviderToken, setDiscordProviderToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGuildsForToken = useCallback(async (providerToken?: string | null) => {
    if (!providerToken) { setGuilds([]); setGuildsError('Discord authorization is missing or expired. Please sign in again.'); return; }
    try { setGuilds(await getDiscordGuildsFromBot(providerToken)); setGuildsError(null); }
    catch (error) { setGuilds([]); setGuildsError(error instanceof Error ? error.message : 'Unable to load Discord servers.'); }
  }, []);

  const applySession = useCallback((nextSession: Session | null, source: string) => {
    logSession(source, nextSession);
    setSession(nextSession); setUser(nextSession ? dashboardUser(nextSession) : null);
    if (!nextSession) { setDiscordProviderToken(null); setGuilds([]); return; }
    // Provider tokens are intentionally memory-only; Supabase may omit them on
    // restored/refresh sessions, but they are available after the code exchange.
    const providerToken = nextSession.provider_token || sessionStorage.getItem(TRANSIENT_PROVIDER_TOKEN);
    if (providerToken) {
      setDiscordProviderToken(providerToken);
      void loadGuildsForToken(providerToken).finally(() => sessionStorage.removeItem(TRANSIENT_PROVIDER_TOKEN));
    }
  }, [loadGuildsForToken]);

  const refreshGuilds = useCallback(async () => {
    await loadGuildsForToken(discordProviderToken || session?.provider_token);
  }, [discordProviderToken, loadGuildsForToken, session]);

  const login = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: `${window.location.origin}/auth/callback`, scopes: 'identify guilds email' } });
    if (error) throw error;
  }, []);
  const logout = useCallback(async () => {
    try { await supabase.auth.signOut(); }
    finally { localStorage.removeItem('selectedGuildId'); sessionStorage.removeItem(TRANSIENT_PROVIDER_TOKEN); setSession(null); setUser(null); setGuilds([]); setGuildsError(null); setDiscordProviderToken(null); }
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => { if (active) { applySession(initialSession, 'getSession'); setLoading(false); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => { if (active) applySession(nextSession, `onAuthStateChange:${event}`); });
    return () => { active = false; subscription.unsubscribe(); };
  }, [applySession]);

  return <AuthContext.Provider value={{ user, guilds, guildsError, loading, isAuthenticated: Boolean(user), login, logout, refreshGuilds }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
