import type { GuildConfig } from '@/types';
import { supabase } from '@/lib/supabase';

const botApiUrl = import.meta.env.VITE_BOT_API_URL?.replace(/\/$/, '');
export const hasBotApi = Boolean(botApiUrl);

async function authorizedRequest(path: string, init: RequestInit = {}, discordAccessToken?: string) {
  if (!botApiUrl) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  const headers: Record<string, string> = { Authorization: `Bearer ${session.access_token}`, ...(init.headers as Record<string, string> || {}) };
  if (discordAccessToken) headers['X-Discord-Access-Token'] = discordAccessToken;
  return fetch(`${botApiUrl}${path}`, { ...init, headers });
}

export async function getGuildConfigFromBot(guildId: string): Promise<GuildConfig | null> {
  try {
    const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/config`);
    if (!response?.ok) return null;
    const payload = await response.json();
    return payload.config as GuildConfig;
  } catch { return null; }
}

export async function updateGuildConfigFromBot(guildId: string, updates: Partial<GuildConfig>, expectedUpdatedAt: string | null): Promise<GuildConfig> {
  const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/config`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates, expectedUpdatedAt }),
  });
  if (!response) throw new Error('Bot API unavailable');
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 409) throw new Error('La configuration a été modifiée dans un autre onglet. Actualisez la page avant de réessayer.');
    throw new Error(payload.error || `Bot API request failed (${response.status})`);
  }
  return payload.config as GuildConfig;
}

export interface DiscordGuildSummary { id: string; name: string; icon: string | null; owner: boolean; permissions: number; bot_present: boolean; member_count: number; }
export interface GuildMetadata { guild: { id: string; name: string; icon: string | null }; channels: Array<{ id: string; name: string; type: number; parent_id: string | null }>; categories: Array<{ id: string; name: string }>; roles: Array<{ id: string; name: string; color: number; position: number }>; emojis: Array<{ id: string | null; name: string; animated: boolean }>; permissions: string; }

export async function getDiscordGuildsFromBot(discordAccessToken: string): Promise<DiscordGuildSummary[]> {
  const response = await authorizedRequest('/api/discord/guilds', {}, discordAccessToken);
  if (!response) throw new Error('Bot API unavailable');
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Bot API request failed (${response.status})`);
  }
  const payload = await response.json();
  return payload.guilds as DiscordGuildSummary[];
}

export async function getGuildMetadataFromBot(guildId: string): Promise<GuildMetadata | null> {
  try {
    const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/metadata`);
    if (!response?.ok) return null;
    return (await response.json()) as GuildMetadata;
  } catch { return null; }
}

export async function invalidateBotGuildConfig(guildId: string): Promise<boolean> {
  try {
    const response = await authorizedRequest(`/api/guilds/${encodeURIComponent(guildId)}/sync`, { method: 'POST' });
    return Boolean(response?.ok);
  } catch { return false; }
}
