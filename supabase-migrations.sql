-- ═══════════════════════════════════════════════════
-- CIVRAT DISCORD BOT - Supabase Database Schema
-- ═══════════════════════════════════════════════════
-- Run this SQL in your Supabase SQL Editor to create all required tables

-- ═══════════════════════════════════════════════════
-- 1. GUILD_CONFIGS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS guild_configs (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL UNIQUE,
  
  -- Basic settings
  bot_prefix TEXT DEFAULT '!',
  bot_name TEXT DEFAULT 'CIVRAT',
  language TEXT DEFAULT 'fr',
  
  -- Welcome
  welcome_enabled BOOLEAN DEFAULT FALSE,
  welcome_channel_id TEXT,
  welcome_message TEXT DEFAULT 'Welcome {user} to {server}! We now have {memberCount} members.',
  welcome_embed_enabled BOOLEAN DEFAULT FALSE,
  welcome_embed_color TEXT DEFAULT '#00e85c',
  welcome_image_enabled BOOLEAN DEFAULT FALSE,
  welcome_dm_enabled BOOLEAN DEFAULT FALSE,
  welcome_dm_message TEXT,
  
  -- Goodbye
  goodbye_enabled BOOLEAN DEFAULT FALSE,
  goodbye_channel_id TEXT,
  goodbye_message TEXT DEFAULT 'Goodbye {username}! We now have {memberCount} members.',
  goodbye_embed_enabled BOOLEAN DEFAULT FALSE,
  goodbye_embed_color TEXT DEFAULT '#ff4444',
  
  -- Tickets
  tickets_enabled BOOLEAN DEFAULT FALSE,
  ticket_category_id TEXT,
  ticket_support_role_id TEXT,
  ticket_panel_title TEXT DEFAULT 'Create a Ticket',
  ticket_panel_description TEXT DEFAULT 'Click the button below to create a support ticket.',
  ticket_panel_color TEXT DEFAULT '#00e85c',
  ticket_log_channel_id TEXT,
  
  -- Logs
  logs_enabled BOOLEAN DEFAULT FALSE,
  log_message_delete_channel_id TEXT,
  log_message_edit_channel_id TEXT,
  log_member_join_channel_id TEXT,
  log_member_leave_channel_id TEXT,
  log_role_update_channel_id TEXT,
  log_channel_update_channel_id TEXT,
  log_moderation_channel_id TEXT,
  
  -- AutoMod
  automod_enabled BOOLEAN DEFAULT FALSE,
  automod_anti_spam BOOLEAN DEFAULT FALSE,
  automod_anti_links BOOLEAN DEFAULT FALSE,
  automod_anti_invites BOOLEAN DEFAULT FALSE,
  automod_anti_ghost_ping BOOLEAN DEFAULT FALSE,
  automod_anti_mention_spam BOOLEAN DEFAULT FALSE,
  automod_anti_caps BOOLEAN DEFAULT FALSE,
  automod_punishment TEXT DEFAULT 'warn',
  automod_mention_threshold INTEGER DEFAULT 5,
  automod_caps_threshold INTEGER DEFAULT 70,
  automod_emoji_threshold INTEGER DEFAULT 10,
  automod_bad_words TEXT[] DEFAULT '{}',
  
  -- Captcha
  captcha_enabled BOOLEAN DEFAULT FALSE,
  captcha_channel_id TEXT,
  captcha_role_id TEXT,
  captcha_type TEXT DEFAULT 'button',
  captcha_success_message TEXT DEFAULT 'You have been verified!',
  captcha_failure_message TEXT DEFAULT 'Verification failed. Please try again.',
  
  -- XP/Leveling
  xp_enabled BOOLEAN DEFAULT FALSE,
  xp_per_message INTEGER DEFAULT 15,
  xp_cooldown INTEGER DEFAULT 60,
  xp_announce_channel_id TEXT,
  level_rewards JSONB DEFAULT '[]'::JSONB,
  role_rewards JSONB DEFAULT '[]'::JSONB,
  
  -- Giveaways
  giveaways_enabled BOOLEAN DEFAULT FALSE,
  
  -- Suggestions
  suggestions_enabled BOOLEAN DEFAULT FALSE,
  suggestions_channel_id TEXT,
  suggestions_approval_channel_id TEXT,
  
  -- Invitations
  invitations_enabled BOOLEAN DEFAULT FALSE,
  invitations_log_channel_id TEXT,
  
  -- Security
  security_enabled BOOLEAN DEFAULT FALSE,
  security_anti_nuke BOOLEAN DEFAULT FALSE,
  security_anti_bot BOOLEAN DEFAULT FALSE,
  security_anti_raid BOOLEAN DEFAULT FALSE,
  security_whitelist TEXT[] DEFAULT '{}',
  security_log_channel_id TEXT,
  security_quarantine_role TEXT,

  -- Temporary voice
  temp_voice_enabled BOOLEAN DEFAULT FALSE,
  temp_voice_category TEXT,
  
  -- Notifications
  notify_security_alert BOOLEAN DEFAULT TRUE,
  notify_weekly_summary BOOLEAN DEFAULT TRUE,
  notify_product_updates BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade an existing guild_configs table safely when this schema is applied
-- after earlier dashboard versions.
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS staff_response TEXT;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS welcome_dm_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS welcome_dm_message TEXT;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS automod_emoji_threshold INTEGER DEFAULT 10;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS automod_bad_words TEXT[] DEFAULT '{}';
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS xp_announce_channel_id TEXT;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS security_quarantine_role TEXT;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS temp_voice_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS temp_voice_category TEXT;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_guild_configs_guild_id ON guild_configs(guild_id);

-- ═══════════════════════════════════════════════════
-- 2. GIVEAWAYS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS giveaways (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  channel_id TEXT,
  duration INTEGER NOT NULL,
  winners_count INTEGER DEFAULT 1,
  requirements TEXT DEFAULT '',
  active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active',
  ends_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_giveaways_guild_id ON giveaways(guild_id);
CREATE INDEX IF NOT EXISTS idx_giveaways_active ON giveaways(active);
CREATE INDEX IF NOT EXISTS idx_giveaways_ends_at ON giveaways(ends_at);

-- ═══════════════════════════════════════════════════
-- 3. SUGGESTIONS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS suggestions (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  staff_response TEXT,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suggestions_guild_id ON suggestions(guild_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);

-- ═══════════════════════════════════════════════════
-- 4. TICKETS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tickets (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  channel_id TEXT,
  category TEXT,
  status TEXT DEFAULT 'open',
  closed BOOLEAN DEFAULT FALSE,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_guild_id ON tickets(guild_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- ═══════════════════════════════════════════════════
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE guild_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaways ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict later based on your auth needs)
-- For production, you should add proper authentication checks

-- guild_configs policies
CREATE POLICY "Allow all operations on guild_configs"
  ON guild_configs FOR ALL
  USING (true)
  WITH CHECK (true);

-- giveaways policies
CREATE POLICY "Allow all operations on giveaways"
  ON giveaways FOR ALL
  USING (true)
  WITH CHECK (true);

-- suggestions policies
CREATE POLICY "Allow all operations on suggestions"
  ON suggestions FOR ALL
  USING (true)
  WITH CHECK (true);

-- tickets policies
CREATE POLICY "Allow all operations on tickets"
  ON tickets FOR ALL
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_guild_configs_updated_at
  BEFORE UPDATE ON guild_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_giveaways_updated_at
  BEFORE UPDATE ON giveaways
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at
  BEFORE UPDATE ON suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════
-- DONE! All tables created successfully.
-- ═══════════════════════════════════════════════════
