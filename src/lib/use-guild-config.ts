import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

export interface GuildConfig {
  [key: string]: unknown;
  guild_id: string;
  welcome_enabled: boolean;
  welcome_channel_id: string | null;
  welcome_message: string;
  welcome_embed_enabled: boolean;
  welcome_embed_color: string;
  welcome_image_enabled: boolean;
  goodbye_enabled: boolean;
  goodbye_channel_id: string | null;
  goodbye_message: string;
  goodbye_embed_enabled: boolean;
  goodbye_embed_color: string;
  tickets_enabled: boolean;
  ticket_category_id: string | null;
  ticket_support_role_id: string | null;
  ticket_panel_title: string;
  ticket_panel_description: string;
  ticket_panel_color: string;
  ticket_log_channel_id: string | null;
  logs_enabled: boolean;
  log_message_delete_channel_id: string | null;
  log_message_edit_channel_id: string | null;
  log_member_join_channel_id: string | null;
  log_member_leave_channel_id: string | null;
  log_role_update_channel_id: string | null;
  log_channel_update_channel_id: string | null;
  log_moderation_channel_id: string | null;
  automod_enabled: boolean;
  automod_anti_spam: boolean;
  automod_anti_links: boolean;
  automod_anti_invites: boolean;
  automod_anti_ghost_ping: boolean;
  automod_anti_mention_spam: boolean;
  automod_anti_caps: boolean;
  automod_punishment: string;
  automod_mention_threshold: number;
  automod_caps_threshold: number;
  captcha_enabled: boolean;
  captcha_channel_id: string | null;
  captcha_role_id: string | null;
  captcha_type: string;
  captcha_success_message: string;
  captcha_failure_message: string;
  xp_enabled: boolean;
  xp_per_message: number;
  xp_cooldown: number;
  level_rewards: { level: number; xp_required: number }[];
  role_rewards: { level: number; role_id: string }[];
  giveaways_enabled: boolean;
  language: string;
  suggestions_enabled: boolean;
  suggestions_channel_id: string | null;
  suggestions_approval_channel_id: string | null;
  invitations_enabled: boolean;
  invitations_log_channel_id: string | null;
  bot_prefix: string;
  bot_name: string;
  notify_security_alert: boolean;
  notify_weekly_summary: boolean;
  notify_product_updates: boolean;
  security_enabled: boolean;
  security_anti_nuke: boolean;
  security_anti_bot: boolean;
  security_anti_raid: boolean;
  security_whitelist: string[];
  security_log_channel_id: string | null;
  created_at: string;
  updated_at: string;
}

const defaultConfig: GuildConfig = {
  guild_id: "",
  welcome_enabled: false,
  welcome_channel_id: null,
  welcome_message: "Welcome {user} to {server}! We now have {memberCount} members.",
  welcome_embed_enabled: false,
  welcome_embed_color: "#00e85c",
  welcome_image_enabled: false,
  goodbye_enabled: false,
  goodbye_channel_id: null,
  goodbye_message: "Goodbye {username}! We now have {memberCount} members.",
  goodbye_embed_enabled: false,
  goodbye_embed_color: "#ff4444",
  tickets_enabled: false,
  ticket_category_id: null,
  ticket_support_role_id: null,
  ticket_panel_title: "Create a Ticket",
  ticket_panel_description: "Click the button below to create a support ticket.",
  ticket_panel_color: "#00e85c",
  ticket_log_channel_id: null,
  logs_enabled: false,
  log_message_delete_channel_id: null,
  log_message_edit_channel_id: null,
  log_member_join_channel_id: null,
  log_member_leave_channel_id: null,
  log_role_update_channel_id: null,
  log_channel_update_channel_id: null,
  log_moderation_channel_id: null,
  automod_enabled: false,
  automod_anti_spam: false,
  automod_anti_links: false,
  automod_anti_invites: false,
  automod_anti_ghost_ping: false,
  automod_anti_mention_spam: false,
  automod_anti_caps: false,
  automod_punishment: "warn",
  automod_mention_threshold: 5,
  automod_caps_threshold: 70,
  captcha_enabled: false,
  captcha_channel_id: null,
  captcha_role_id: null,
  captcha_type: "button",
  captcha_success_message: "You have been verified!",
  captcha_failure_message: "Verification failed. Please try again.",
  xp_enabled: false,
  xp_per_message: 15,
  xp_cooldown: 60,
  level_rewards: [],
  role_rewards: [],
  giveaways_enabled: false,
  language: "en",
  suggestions_enabled: false,
  suggestions_channel_id: null,
  suggestions_approval_channel_id: null,
  invitations_enabled: false,
  invitations_log_channel_id: null,
  bot_prefix: "!",
  bot_name: "CIVRAT",
  notify_security_alert: true,
  notify_weekly_summary: true,
  notify_product_updates: false,
  security_enabled: false,
  security_anti_nuke: false,
  security_anti_bot: false,
  security_anti_raid: false,
  security_whitelist: [],
  security_log_channel_id: null,
  created_at: "",
  updated_at: "",
};

export function useGuildConfig() {
  const { selectedGuild } = useAuth();
  const guildId = selectedGuild?.id ?? "";
  const [config, setConfigState] = useState<GuildConfig>({ ...defaultConfig, guild_id: guildId });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!guildId) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("guild_configs")
      .select("*")
      .eq("guild_id", guildId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setConfigState({ ...defaultConfig, ...data, guild_id: guildId });
        } else {
          setConfigState({ ...defaultConfig, guild_id: guildId });
        }
        setLoading(false);
      });
  }, [guildId]);

  const setConfig = useCallback((updates: Partial<GuildConfig> | Record<string, unknown>) => {
    setConfigState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!guildId) return;
    setSaving(true);
    await supabase
      .from("guild_configs")
      .upsert({ ...config, guild_id: guildId, updated_at: new Date().toISOString() }, { onConflict: "guild_id" });
    setSaving(false);
  }, [config, guildId]);

  return { config, setConfig, loading, saving, handleSave };
}
