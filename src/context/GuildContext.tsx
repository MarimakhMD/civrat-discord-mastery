import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { GuildConfig } from '@/types';
import { getGuildConfigFromBot, getGuildMetadataFromBot, updateGuildConfigFromBot, type GuildMetadata } from '@/lib/bot-sync';

interface GuildState {
  selectedGuildId: string | null; config: GuildConfig; metadata: GuildMetadata | null; error: string | null;
  selectGuild: (id: string) => Promise<void>; refreshMetadata: () => Promise<void>; updateConfig: (data: Partial<GuildConfig>) => Promise<void>; loading: boolean;
}
const GuildContext = createContext<GuildState | null>(null);

/** Canonical guild_configs defaults: aligned with bot/src/services/guildConfig.js. */
const defaultConfig: GuildConfig = {
  id: 0, guild_id: '', bot_prefix: '!', bot_name: 'CIVRAT', language: 'fr',
  welcome_enabled: false, welcome_channel_id: null, welcome_message: 'Welcome {user} to {server}! We now have {memberCount} members.', welcome_embed_enabled: false, welcome_embed_color: '#00e85c', welcome_image_enabled: false, welcome_dm_enabled: false, welcome_dm_message: null,
  goodbye_enabled: false, goodbye_channel_id: null, goodbye_message: 'Goodbye {username}! We now have {memberCount} members.', goodbye_embed_enabled: false, goodbye_embed_color: '#ff4444',
  tickets_enabled: false, ticket_category_id: null, ticket_support_role_id: null, ticket_panel_title: 'Create a Ticket', ticket_panel_description: 'Click the button below to create a support ticket.', ticket_panel_color: '#00e85c', ticket_log_channel_id: null,
  logs_enabled: false, log_message_delete_channel_id: null, log_message_edit_channel_id: null, log_member_join_channel_id: null, log_member_leave_channel_id: null, log_role_update_channel_id: null, log_channel_update_channel_id: null, log_moderation_channel_id: null,
  automod_enabled: false, automod_anti_spam: false, automod_anti_links: false, automod_anti_invites: false, automod_anti_ghost_ping: false, automod_anti_mention_spam: false, automod_anti_caps: false, automod_punishment: 'warn', automod_mention_threshold: 5, automod_caps_threshold: 70, automod_emoji_threshold: 10, automod_bad_words: [],
  captcha_enabled: false, captcha_channel_id: null, captcha_role_id: null, captcha_type: 'button', captcha_success_message: 'You have been verified!', captcha_failure_message: 'Verification failed. Please try again.',
  xp_enabled: false, xp_per_message: 15, xp_cooldown: 60, xp_announce_channel_id: null, level_rewards: [], role_rewards: [],
  giveaways_enabled: false, suggestions_enabled: false, suggestions_channel_id: null, suggestions_approval_channel_id: null,
  invitations_enabled: false, invitations_log_channel_id: null,
  security_enabled: false, security_anti_nuke: false, security_anti_bot: false, security_anti_raid: false, security_whitelist: [], security_log_channel_id: null, security_quarantine_role: null,
  temp_voice_enabled: false, temp_voice_category: null, temp_voice_creator_channel_id: null,
  notify_security_alert: true, notify_weekly_summary: true, notify_product_updates: false, updated_at: new Date().toISOString(),
};

export function GuildProvider({ children }: { children: ReactNode }) {
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(() => localStorage.getItem('selectedGuildId'));
  const [config, setConfig] = useState<GuildConfig>(defaultConfig);
  const [metadata, setMetadata] = useState<GuildMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectGuild = useCallback(async (id: string) => {
    setLoading(true); setSelectedGuildId(id); localStorage.setItem('selectedGuildId', id);
    try {
      setError(null);
      const [apiConfig, guildMetadata] = await Promise.all([getGuildConfigFromBot(id), getGuildMetadataFromBot(id)]);
      if (!apiConfig || !guildMetadata) throw new Error('Configuration sécurisée indisponible.');
      setConfig({ ...defaultConfig, ...apiConfig, guild_id: id });
      setMetadata(guildMetadata);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Impossible de charger la configuration du serveur.';
      setError(message);
      throw loadError;
    } finally { setLoading(false); }
  }, []);

  // Restore the persisted guild configuration on a page refresh before any module renders its form state.
  useEffect(() => {
    if (!selectedGuildId) return;
    const timer = window.setTimeout(() => { void selectGuild(selectedGuildId).catch(() => {}); }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedGuildId, selectGuild]);

  const refreshMetadata = useCallback(async () => {
    if (!selectedGuildId) return;
    const guildMetadata = await getGuildMetadataFromBot(selectedGuildId);
    if (guildMetadata) setMetadata(guildMetadata);
  }, [selectedGuildId]);

  // Discord gateway events update the bot cache immediately. Polling this
  // lightweight metadata endpoint keeps the dashboard current without polling
  // every module or hitting Discord directly from the browser.
  useEffect(() => {
    if (!selectedGuildId) return;
    const timer = window.setInterval(() => { void refreshMetadata(); }, 30_000);
    return () => window.clearInterval(timer);
  }, [selectedGuildId, refreshMetadata]);

  const updateConfig = useCallback(async (data: Partial<GuildConfig>) => {
    if (!selectedGuildId) throw new Error('Sélectionnez un serveur avant d’enregistrer.');
    setLoading(true);
    try {
      setError(null);
      const apiConfig = await updateGuildConfigFromBot(selectedGuildId, data);
      if (!apiConfig) throw new Error('Sauvegarde sécurisée indisponible.');
      setConfig({ ...defaultConfig, ...apiConfig, guild_id: selectedGuildId });
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Sauvegarde sécurisée indisponible.';
      setError(message);
      throw saveError;
    } finally { setLoading(false); }
  }, [selectedGuildId]);

  return <GuildContext.Provider value={{ selectedGuildId, config, metadata, error, selectGuild, refreshMetadata, updateConfig, loading }}>{children}</GuildContext.Provider>;
}
export function useGuild() { const ctx = useContext(GuildContext); if (!ctx) throw new Error('useGuild must be used within GuildProvider'); return ctx; }
