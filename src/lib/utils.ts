import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

export function getGuildIconUrl(guildId: string, icon: string | null, size = 128): string {
  if (icon) return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png?size=${size}`;
  return '';
}

export function canManageGuild(permissions: number): boolean {
  return (permissions & 0x8) === 0x8 || (permissions & 0x20) === 0x20;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
