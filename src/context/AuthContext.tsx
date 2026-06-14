import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Guild } from '@/types';
import { supabase } from '@/lib/supabase';
import { canManageGuild } from '@/lib/utils';

interface AuthState {
  user: User | null; guilds: Guild[]; loading: boolean; isAuthenticated: boolean;
  login: () => void; logout: () => Promise<void>; refreshGuilds: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  const login = useCallback(() => {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID, redirect_uri: REDIRECT_URI,
      response_type: 'code', scope: 'identify guilds email', prompt: 'consent',
    });
    window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null); setGuilds([]);
  }, []);

  const refreshGuilds = useCallback(async () => {
    const demoGuilds: Guild[] = [
      { id: '111111111111111111', name: 'CIVRAT Community', icon: null, owner: true, permissions: 0x8, bot_present: true, member_count: 15420 },
      { id: '222222222222222222', name: 'Gaming Hub', icon: null, owner: false, permissions: 0x20, bot_present: true, member_count: 8340 },
      { id: '333333333333333333', name: 'Dev Server', icon: null, owner: true, permissions: 0x8, bot_present: false, member_count: 245 },
      { id: '444444444444444444', name: 'Music Lounge', icon: null, owner: false, permissions: 0x28, bot_present: true, member_count: 3200 },
    ];
    setGuilds(demoGuilds.filter(g => canManageGuild(g.permissions)));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          setUser({
            id: session.user.id, discord_id: meta?.provider_id || '', username: meta?.full_name || 'User',
            discriminator: meta?.discriminator || '0000', avatar: meta?.avatar || null,
            email: session.user.email || null, created_at: session.user.created_at,
            is_premium: false, premium_expires_at: null,
          });
        } else {
          setUser({ id: 'demo', discord_id: '123456789', username: 'CIVRAT_Demo', discriminator: '0001', avatar: null, email: 'demo@civrat.dev', created_at: new Date().toISOString(), is_premium: false, premium_expires_at: null });
        }
      } catch {
        setUser({ id: 'demo', discord_id: '123456789', username: 'CIVRAT_Demo', discriminator: '0001', avatar: null, email: 'demo@civrat.dev', created_at: new Date().toISOString(), is_premium: false, premium_expires_at: null });
      }
      await refreshGuilds();
      setLoading(false);
    })();
  }, [refreshGuilds]);

  return (
    <AuthContext.Provider value={{ user, guilds, loading, isAuthenticated: !!user, login, logout, refreshGuilds }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
