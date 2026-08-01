const DISCORD_API = "https://discord.com/api/v10";

/**
 * OAuth code exchanges require a confidential server credential and must never
 * run in Vite/browser code. The active dashboard uses the authorized bot API.
 */
export async function exchangeCode(code: string): Promise<{ access_token: string }> {
  void code;
  throw new Error("Discord OAuth code exchange must be handled by a server endpoint.");
}

export async function fetchDiscordUser(accessToken: string) {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchUserGuilds(accessToken: string) {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch guilds");
  return res.json();
}
