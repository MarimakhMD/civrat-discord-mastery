const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { PermissionsBitField } = require("discord.js");
const { config } = require("../config");
const { supabase } = require("../config/database");
const logger = require("../utils/logger");

const SYNC_COOLDOWN_MS = 8_000;
const USER_SYNC_WINDOW_MS = 15 * 60 * 1_000;
const USER_SYNC_MAX = 20;
const guildSyncState = new Map();
const userSyncRequests = new Map();

function discordIdFromUser(user) {
  const meta = user.user_metadata || {};
  return String(meta.provider_id || meta.sub || meta.id || user.id || "");
}

function userRateLimited(userId) {
  const now = Date.now();
  const recent = (userSyncRequests.get(userId) || []).filter((time) => now - time < USER_SYNC_WINDOW_MS);
  if (recent.length >= USER_SYNC_MAX) { userSyncRequests.set(userId, recent); return true; }
  recent.push(now); userSyncRequests.set(userId, recent); return false;
}

async function reloadGuildConfig(guildId, reason = "sync") {
  const guildConfigService = require("../services/guildConfig");
  guildConfigService.invalidateCache(guildId);
  await guildConfigService.getGuildConfig(guildId);
  guildSyncState.set(guildId, { lastSyncAt: Date.now(), timer: null });
  logger.info(`Guild config reloaded for ${guildId} (${reason})`);
}

function scheduleGuildReload(guildId, waitMs) {
  const state = guildSyncState.get(guildId) || { lastSyncAt: 0, timer: null };
  if (state.timer) return;
  state.timer = setTimeout(() => {
    reloadGuildConfig(guildId, "coalesced sync").catch((error) => logger.error(`Deferred guild sync failed for ${guildId}:`, error.message));
  }, waitMs);
  guildSyncState.set(guildId, state);
}

function createServer(discordClient) {
  const app = express();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: [config.dashboardUrl, "http://localhost:3000"], credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: "Too many requests" } }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime(), bot: discordClient?.user?.tag || "not connected", guilds: discordClient?.guilds?.cache?.size || 0, ping: discordClient?.ws?.ping || -1 }));
  app.get("/", (req, res) => res.json({ name: "CIVRAT Bot API", version: "2.0.0" }));

  app.post("/api/guilds/:guildId/sync", async (req, res) => {
    const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token || !supabase) { logger.warn("Guild sync denied: missing authentication"); return res.status(401).json({ error: "Unauthorized" }); }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) { logger.warn("Guild sync denied: invalid session"); return res.status(401).json({ error: "Unauthorized" }); }
    const guildId = req.params.guildId;
    if (!/^\d{15,22}$/.test(guildId)) return res.status(400).json({ error: "Invalid guild ID" });
    const guild = discordClient.guilds.cache.get(guildId);
    if (!guild) { logger.warn(`Guild sync denied: unavailable guild ${guildId}`); return res.status(404).json({ error: "Guild not found" }); }
    const discordId = discordIdFromUser(user);
    const member = guild.members.cache.get(discordId) || await guild.members.fetch(discordId).catch(() => null);
    if (!member) { logger.warn(`Guild sync denied: user ${user.id} is not a member of ${guildId}`); return res.status(403).json({ error: "Guild membership required" }); }
    const canManage = member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageGuild);
    if (!canManage) { logger.warn(`Guild sync denied: insufficient permissions for user ${user.id} on ${guildId}`); return res.status(403).json({ error: "Manage Guild permission required" }); }
    if (userRateLimited(user.id)) { logger.warn(`Guild sync rate limited: user ${user.id}`); return res.status(429).json({ error: "Too many synchronization requests" }); }

    const state = guildSyncState.get(guildId) || { lastSyncAt: 0, timer: null };
    const elapsed = Date.now() - state.lastSyncAt;
    if (elapsed < SYNC_COOLDOWN_MS) {
      const retryAfter = SYNC_COOLDOWN_MS - elapsed;
      scheduleGuildReload(guildId, retryAfter);
      logger.info(`Guild sync coalesced for ${guildId}; reload in ${retryAfter}ms`);
      return res.status(202).json({ success: true, scheduled: true, retryAfter });
    }
    try {
      await reloadGuildConfig(guildId);
      return res.json({ success: true, scheduled: false });
    } catch (syncError) {
      logger.error(`Guild config sync failed for ${guildId}:`, syncError.message);
      return res.status(503).json({ error: "Configuration reload unavailable" });
    }
  });

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));
  app.listen(config.apiPort, () => logger.success(`API server running on port ${config.apiPort}`));
  return app;
}

module.exports = { createServer };
