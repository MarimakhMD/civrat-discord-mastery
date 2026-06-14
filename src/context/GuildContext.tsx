import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { GuildConfig } from '@/types';

interface GuildState {
  selectedGuildId: string | null; config: GuildConfig;
  selectGuild: (id: string) => void; updateConfig: (data: Partial<GuildConfig>) => Promise<void>; loading: boolean;
}

const GuildContext = createContext<GuildState | null>(null);

const defaultConfig: GuildConfig = {
  id: '', guild_id: '', prefix: '!', language: 'en',
  welcome_enabled: false, welcome_channel_id: null, welcome_message: 'Welcome {user} to {server}!', welcome_embed_enabled: true,
  goodbye_enabled: false, goodbye_channel_id: null, goodbye_message: 'Goodbye {user}!',
  automod_enabled: false, automod_max_mentions: 5, automod_max_emojis: 10, automod_anti_spam: true, automod_anti_invite: true, automod_anti_link: false, automod_bad_words: [],
  captcha_enabled: false, captcha_channel_id: null, captcha_role_id: null, captcha_type: 'image',
  xp_enabled: false, xp_rate: 1, xp_cooldown: 60, xp_announce_channel: null, level_roles: [],
  tickets_enabled: false, tickets_category_id: null, tickets_support_role_id: null, tickets_transcript_channel: null,
  logs_enabled: false, logs_channel_id: null, log_events: ['member_join', 'member_leave', 'message_delete', 'message_edit'],
  giveaways_enabled: true, suggestions_enabled: false, suggestions_channel_id: null,
  security_enabled: false, security_anti_nuke: false, security_anti_raid: false, security_quarantine_role: null,
  invtrack_enabled: false, invtrack_channel: null, temp_voice_enabled: false, temp_voice_category: null,
  premium: false, updated_at: new Date().toISOString(),
};

export function GuildProvider({ children }: { children: ReactNode }) {
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(() => localStorage.getItem('selectedGuildId'));
  const [config, setConfig] = useState<GuildConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);

  const selectGuild = useCallback((id: string) => {
    setSelectedGuildId(id); localStorage.setItem('selectedGuildId', id);
    setConfig({ ...defaultConfig, guild_id: id, id: `cfg-${id}` });
  }, []);

  const updateConfig = useCallback(async (data: Partial<GuildConfig>) => {
    setLoading(true);
    try { setConfig(prev => ({ ...prev, ...data })); } finally { setLoading(false); }
  }, []);

  return (
    <GuildContext.Provider value={{ selectedGuildId, config, selectGuild, updateConfig, loading }}>
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild() {
  const ctx = useContext(GuildContext);
  if (!ctx) throw new Error('useGuild must be used within GuildProvider');
  return ctx;
}
