export interface User {
  id: string; discord_id: string; username: string; discriminator: string;
  avatar: string | null; email: string | null; created_at: string;
  is_premium: boolean; premium_expires_at: string | null;
}

export interface Guild {
  id: string; name: string; icon: string | null; owner: boolean;
  permissions: number; bot_present: boolean; member_count: number;
}

export interface GuildConfig {
  id: string; guild_id: string; prefix: string; language: string;
  welcome_enabled: boolean; welcome_channel_id: string | null; welcome_message: string | null; welcome_embed_enabled: boolean;
  goodbye_enabled: boolean; goodbye_channel_id: string | null; goodbye_message: string | null;
  automod_enabled: boolean; automod_max_mentions: number; automod_max_emojis: number;
  automod_anti_spam: boolean; automod_anti_invite: boolean; automod_anti_link: boolean; automod_bad_words: string[];
  captcha_enabled: boolean; captcha_channel_id: string | null; captcha_role_id: string | null; captcha_type: string;
  xp_enabled: boolean; xp_rate: number; xp_cooldown: number; xp_announce_channel: string | null; level_roles: LevelRole[];
  tickets_enabled: boolean; tickets_category_id: string | null; tickets_support_role_id: string | null; tickets_transcript_channel: string | null;
  logs_enabled: boolean; logs_channel_id: string | null; log_events: string[];
  giveaways_enabled: boolean; suggestions_enabled: boolean; suggestions_channel_id: string | null;
  security_enabled: boolean; security_anti_nuke: boolean; security_anti_raid: boolean; security_quarantine_role: string | null;
  invtrack_enabled: boolean; invtrack_channel: string | null;
  temp_voice_enabled: boolean; temp_voice_category: string | null;
  premium: boolean; updated_at: string;
}

export interface LevelRole { level: number; role_id: string; }
