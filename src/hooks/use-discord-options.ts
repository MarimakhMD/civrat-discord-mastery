import { useGuild } from '@/context/GuildContext';

export function useDiscordOptions() {
  const { metadata } = useGuild();
  const channels = metadata?.channels ?? [];
  return {
    categories: metadata?.categories.map((category) => ({ value: category.id, label: `📁 ${category.name}` })) ?? [],
    roles: metadata?.roles.map((role) => ({ value: role.id, label: `@${role.name}` })) ?? [],
    textChannels: channels.filter((channel) => [0, 5, 15].includes(channel.type)).map((channel) => ({ value: channel.id, label: `#${channel.name}` })),
    voiceChannels: channels.filter((channel) => channel.type === 2).map((channel) => ({ value: channel.id, label: `🔊 ${channel.name}` })),
  };
}
