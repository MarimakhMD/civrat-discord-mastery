// ═══════════════════════════════════════════════════
// GUILD CONFIG SERVICE - Reads from Supabase
// ═══════════════════════════════════════════════════
// Supabase is the single source of truth for guild configuration.
// This service provides cached access to guild configs with
// automatic invalidation and fallback defaults.

const { supabase } = require("../config/database");
const logger = require("../utils/logger");

// In-memory cache with TTL
const configCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Default configuration matching dashboard's defaultConfig
const defaultConfig = {
  guild_id: "",
  welcome_enabled: false,
  welcome_channel_id: null,
  welcome_message: "Welcome {user} to {server}! We now have {memberCount} members.",
  welcome_embed_enabled: false,
  welcome_embed_color: "#00e85c",
  welcome_image_enabled: false,
  welcome_dm_enabled: false,
  welcome_dm_message: null,
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
  automod_emoji_threshold: 10,
  automod_bad_words: [],
  captcha_enabled: false,
  captcha_channel_id: null,
  captcha_role_id: null,
  captcha_type: "button",
  captcha_success_message: "You have been verified!",
  captcha_failure_message: "Verification failed. Please try again.",
  xp_enabled: false,
  xp_per_message: 15,
  xp_cooldown: 60,
  xp_announce_channel_id: null,
  level_rewards: [],
  role_rewards: [],
  giveaways_enabled: false,
  language: "fr",
  suggestions_enabled: false,
  suggestions_channel_id: null,
  suggestions_approval_channel_id: null,
  invitations_enabled: false,
  invitations_log_channel_id: null,
  bot_log_channel_id: null,
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
  security_quarantine_role: null,
  temp_voice_enabled: false,
  temp_voice_category: null,
  temp_voice_creator_channel_id: null,
};

/**
 * Get guild configuration from Supabase (with cache)
 * @param {string} guildId - Discord guild ID
 * @returns {Promise<Object>} Guild configuration
 */
async function getGuildConfig(guildId) {
  // Check cache first
  if (configCache.has(guildId)) {
    const cached = configCache.get(guildId);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.config;
    }
  }

  // Fetch from Supabase
  try {
    if (!supabase) {
      logger.warn("Supabase not available, using default config");
      return { ...defaultConfig, guild_id: guildId };
    }

    const { data, error } = await supabase
      .from("guild_configs")
      .select("*")
      .eq("guild_id", guildId)
      .maybeSingle();

    if (error) {
      logger.error(`Supabase query failed for guild ${guildId}:`, error.message);
      return { ...defaultConfig, guild_id: guildId };
    }

    // Merge with defaults (Supabase values override defaults)
    const config = { ...defaultConfig, ...data, guild_id: guildId, updated_at: data?.updated_at || null };

    // Cache the result
    configCache.set(guildId, {
      config,
      timestamp: Date.now(),
    });

    return config;
  } catch (err) {
    logger.error(`Failed to fetch guild config for ${guildId}:`, err.message);
    return { ...defaultConfig, guild_id: guildId };
  }
}

/**
 * Update guild configuration in Supabase
 * @param {string} guildId - Discord guild ID
 * @param {Object} updates - Partial configuration updates
 * @returns {Promise<Object|null>} Updated configuration
 */
async function updateGuildConfig(guildId, updates, expectedUpdatedAt) {
  try {
    if (!supabase) {
      logger.error("Supabase not available for update");
      return { config: null, conflict: false };
    }

    const updateData = { ...updates, updated_at: new Date().toISOString() };
    let data;
    let error;

    if (expectedUpdatedAt === null) {
      ({ data, error } = await supabase
        .from("guild_configs")
        .insert({ ...updateData, guild_id: guildId })
        .select()
        .single());
      if (error?.code === '23505') return { config: null, conflict: true };
    } else {
      ({ data, error } = await supabase
        .from("guild_configs")
        .update(updateData)
        .eq("guild_id", guildId)
        .eq("updated_at", expectedUpdatedAt)
        .select()
        .maybeSingle());
      if (!error && !data) return { config: null, conflict: true };
    }

    if (error) {
      logger.error(`Supabase update failed for guild ${guildId}:`, error.message);
      return { config: null, conflict: false };
    }

    configCache.delete(guildId);
    return { config: { ...defaultConfig, ...data, guild_id: guildId }, conflict: false };
  } catch (err) {
    logger.error(`Failed to update guild config for ${guildId}:`, err.message);
    return { config: null, conflict: false };
  }
}
/**
 * Invalidate cache for a specific guild
 */
function invalidateCache(guildId) {
  configCache.delete(guildId);
}

/**
 * Clear all cached configs
 */
function clearAllCache() {
  configCache.clear();
}

/**
 * Preload configs for all guilds the bot is in
 */
async function preloadConfigs(client) {
  const guildIds = Array.from(client.guilds.cache.keys());
  logger.info(`Preloading configs for ${guildIds.length} guilds...`);

  for (const guildId of guildIds) {
    await getGuildConfig(guildId);
  }

  logger.success(`Preloaded ${guildIds.length} guild configs`);
}

module.exports = {
  getGuildConfig,
  updateGuildConfig,
  invalidateCache,
  clearAllCache,
  preloadConfigs,
  defaultConfig,
};
