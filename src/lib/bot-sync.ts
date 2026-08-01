import type { GuildConfig } from '@/types';
import { supabase } from '@/lib/supabase';

const botApiUrl = import.meta.env.VITE_BOT_API_URL?.replace(/\/$/, '');
export const hasBotApi = Boolean(botApiUrl);

async function authorizedRequest(path: string, init: RequestInit = {}) {
  if (!botApiUrl) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  const response = await fetch(`${botApiUrl}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${session.access_token}`, ...(init.headers || {}) },
  });
  return response;
}

export async function getGuildConfigFromBot(guildId: string): Promise<GuildConfig | null> {
  try {
    const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/config`);
    if (!response?.ok) return null;
    const payload = await response.json();
    return payload.config as GuildConfig;
  } catch { return null; }
}

export async function updateGuildConfigFromBot(guildId: string, updates: Partial<GuildConfig>): Promise<GuildConfig | null> {
  try {
    const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/config`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates }),
    });
    if (!response?.ok) return null;
    const payload = await response.json();
    return payload.config as GuildConfig;
  } catch { return null; }
}

export async function invalidateBotGuildConfig(guildId: string): Promise<boolean> {
  try {
    const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/sync`, { method: 'POST' });
    return Boolean(response?.ok);
  } catch { return false; }
}
