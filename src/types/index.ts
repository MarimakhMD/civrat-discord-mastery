export interface User {
  id: string; discord_id: string; username: string; discriminator: string;
  avatar: string | null; email: string | null; created_at: string;
  is_premium: boolean; premium_expires_at: string | null;
}

export interface Guild {
  id: string; name: string; icon: string | null; owner: boolean;
  permissions: number; bot_present: boolean; member_count: number;
}

/** Canonical `guild_configs` contract shared by React, Supabase and the bot. */
export interface GuildConfig {
  id: number; guild_id: string; bot_prefix: string; bot_name: string; language: string;
  welcome_enabled: boolean; welcome_channel_id: string | null; welcome_message: string | null; welcome_embed_enabled: boolean; welcome_embed_color: string; welcome_image_enabled: boolean; welcome_dm_enabled: boolean; welcome_dm_message: string | null;
  goodbye_enabled: boolean; goodbye_channel_id: string | null; goodbye_message: string | null; goodbye_embed_enabled: boolean; goodbye_embed_color: string;
  tickets_enabled: boolean; ticket_category_id: string | null; ticket_support_role_id: string | null; ticket_panel_title: string; ticket_panel_description: string; ticket_panel_color: string; ticket_log_channel_id: string | null;
  logs_enabled: boolean; log_message_delete_channel_id: string | null; log_message_edit_channel_id: string | null; log_member_join_channel_id: string | null; log_member_leave_channel_id: string | null; log_role_update_channel_id: string | null; log_channel_update_channel_id: string | null; log_moderation_channel_id: string | null;
  automod_enabled: boolean; automod_anti_spam: boolean; automod_anti_links: boolean; automod_anti_invites: boolean; automod_anti_ghost_ping: boolean; automod_anti_mention_spam: boolean; automod_anti_caps: boolean; automod_punishment: string; automod_mention_threshold: number; automod_caps_threshold: number; automod_emoji_threshold: number; automod_bad_words: string[];
  captcha_enabled: boolean; captcha_channel_id: string | null; captcha_role_id: string | null; captcha_type: string; captcha_success_message: string; captcha_failure_message: string;
  xp_enabled: boolean; xp_per_message: number; xp_cooldown: number; xp_announce_channel_id: string | null; level_rewards: LevelReward[]; role_rewards: LevelRole[];
  giveaways_enabled: boolean; suggestions_enabled: boolean; suggestions_channel_id: string | null; suggestions_approval_channel_id: string | null;
  invitations_enabled: boolean; invitations_log_channel_id: string | null;
  security_enabled: boolean; security_anti_nuke: boolean; security_anti_bot: boolean; security_anti_raid: boolean; security_whitelist: string[]; security_log_channel_id: string | null; security_quarantine_role: string | null;
  temp_voice_enabled: boolean; temp_voice_category: string | null; temp_voice_creator_channel_id: string | null;
  notify_security_alert: boolean; notify_weekly_summary: boolean; notify_product_updates: boolean;
  updated_at: string | null;
}
export interface LevelRole { level: number; role_id: string; }
export interface LevelReward { level: number; xp_required: number; }
