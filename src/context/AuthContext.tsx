import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { User, Guild } from '@/types';
import { supabase } from '@/lib/supabase';
import { getDiscordGuildsFromBot } from '@/lib/bot-sync';

interface AuthState {
  user: User | null; guilds: Guild[]; loading: boolean; isAuthenticated: boolean;
  login: () => Promise<void>; logout: () => Promise<void>; refreshGuilds: () => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);

function dashboardUser(session: Session): User {
  const meta = session.user.user_metadata || {};
  return {
    id: session.user.id, discord_id: String(meta.provider_id || meta.sub || meta.id || ''),
    username: String(meta.full_name || meta.user_name || meta.name || 'Discord user'), discriminator: String(meta.discriminator || '0000'),
    avatar: meta.avatar_url || meta.avatar || null, email: session.user.email || null, created_at: session.user.created_at,
    is_premium: false, premium_expires_at: null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGuildsForToken = useCallback(async (providerToken?: string | null) => {
    if (!providerToken) { setGuilds([]); return; }
    setGuilds(await getDiscordGuildsFromBot(providerToken));
  }, []);

  const refreshGuilds = useCallback(async () => {
    await loadGuildsForToken(session?.provider_token);
  }, [loadGuildsForToken, session]);

  const login = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/auth/callback`, scopes: 'identify guilds email' },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    try { await supabase.auth.signOut(); }
    finally { localStorage.removeItem('selectedGuildId'); setSession(null); setUser(null); setGuilds([]); }
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!active) return;
      setSession(initialSession); setUser(initialSession ? dashboardUser(initialSession) : null); void loadGuildsForToken(initialSession?.provider_token); setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession); setUser(nextSession ? dashboardUser(nextSession) : null);
      void loadGuildsForToken(nextSession?.provider_token);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [loadGuildsForToken]);

  return <AuthContext.Provider value={{ user, guilds, loading, isAuthenticated: Boolean(user), login, logout, refreshGuilds }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
