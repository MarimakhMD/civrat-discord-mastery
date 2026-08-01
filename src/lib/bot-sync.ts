import { supabase } from '@/lib/supabase';

const botApiUrl = import.meta.env.VITE_BOT_API_URL?.replace(/\/$/, '');

/**
 * Requests a reload only for the saved guild. The Supabase session bearer token
 * is validated by the bot API; no bot/API secret is ever bundled in Vite.
 */
export async function invalidateBotGuildConfig(guildId: string): Promise<boolean> {
  if (!botApiUrl) return false;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return false;
  try {
    const response = await fetch(`${botApiUrl}/api/guilds/${encodeURIComponent(guildId)}/sync`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    return response.ok;
  } catch {
    // Saving in Supabase remains successful; the bot TTL is the safe fallback.
    return false;
  }
}
