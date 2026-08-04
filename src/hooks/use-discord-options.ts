import { useGuild } from '@/context/GuildContext';

export function useDiscordOptions() {
  const { metadata } = useGuild();
  const channels = metadata?.channels ?? [];
  const sort = <T extends { label: string }>(items: T[]) => items.sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
  return {
    categories: sort(metadata?.categories.map((category) => ({ value: category.id, label: `📁 ${category.name}` })) ?? []),
    roles: sort(metadata?.roles.map((role) => ({ value: role.id, label: `@${role.name}` })) ?? []),
    textChannels: sort(channels.filter((channel) => [0, 5, 15].includes(channel.type)).map((channel) => ({ value: channel.id, label: `#${channel.name}` }))),
    voiceChannels: sort(channels.filter((channel) => channel.type === 2).map((channel) => ({ value: channel.id, label: `🔊 ${channel.name}` }))),
  };
}
