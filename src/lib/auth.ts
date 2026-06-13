import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: number;
}

interface AuthState {
  user: DiscordUser | null;
  accessToken: string | null;
  guilds: DiscordGuild[];
  selectedGuild: DiscordGuild | null;
  isAuthenticated: boolean;
  setUser: (user: DiscordUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setGuilds: (guilds: DiscordGuild[]) => void;
  setSelectedGuild: (guild: DiscordGuild | null) => void;
  logout: () => void;
}

const ADMINISTRATOR = 0x8;
const MANAGE_GUILD = 0x20;

function hasAdminPermission(permissions: number): boolean {
  return (permissions & ADMINISTRATOR) === ADMINISTRATOR || (permissions & MANAGE_GUILD) === MANAGE_GUILD;
}

export function filterAdminGuilds(guilds: DiscordGuild[]): DiscordGuild[] {
  return guilds.filter((g) => g.owner || hasAdminPermission(g.permissions));
}

export function getDiscordOAuthUrl(): string {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  if (!clientId) return "";
  const redirectUri = `${window.location.origin}/login`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds",
    prompt: "consent",
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

export function getUserAvatarUrl(userId: string, avatar: string | null): string {
  if (!avatar) return "https://cdn.discordapp.com/embed/avatars/0.png";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=256`;
}

export function getGuildIconUrl(guildId: string, icon: string | null): string {
  if (!icon) return "";
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png?size=128`;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      guilds: [],
      selectedGuild: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setGuilds: (guilds) => set({ guilds }),
      setSelectedGuild: (selectedGuild) => set({ selectedGuild }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          guilds: [],
          selectedGuild: null,
          isAuthenticated: false,
        }),
    }),
    { name: "civrat-auth" },
  ),
);
