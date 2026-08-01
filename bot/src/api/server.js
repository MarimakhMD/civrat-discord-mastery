// ═══════════════════════════════════════════════════
// API SERVER - Express for dashboard health checks
// ═══════════════════════════════════════════════════

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { config } = require("../config");
const { supabase } = require("../config/database");
const logger = require("../utils/logger");

function createServer(discordClient) {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: [config.dashboardUrl, "http://localhost:3000"], credentials: true }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests" },
  });
  app.use("/api/", limiter);
  app.use(express.json({ limit: "1mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      bot: discordClient?.user?.tag || "not connected",
      guilds: discordClient?.guilds?.cache?.size || 0,
      ping: discordClient?.ws?.ping || -1,
    });
  });

  // Root
  app.get("/", (req, res) => {
    res.json({ name: "CIVRAT Bot API", version: "2.0.0" });
  });

  // Reload one guild after a dashboard save. A Supabase access token is
  // mandatory, so no shared API secret is exposed in the dashboard bundle.
  app.post("/api/guilds/:guildId/sync", async (req, res) => {
    const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token || !supabase) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: "Unauthorized" });
    const guildId = req.params.guildId;
    if (!/^\d{15,22}$/.test(guildId)) return res.status(400).json({ error: "Invalid guild ID" });
    try {
      const guildConfigService = require("../services/guildConfig");
      guildConfigService.invalidateCache(guildId);
      // Warm just this entry now rather than waiting for the normal five-minute TTL.
      await guildConfigService.getGuildConfig(guildId);
      return res.json({ success: true, guildId });
    } catch (syncError) {
      logger.error(`Guild config sync failed for ${guildId}:`, syncError.message);
      return res.status(503).json({ error: "Configuration reload unavailable" });
    }
  });

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));

  app.listen(config.apiPort, () => {
    logger.success(`API server running on port ${config.apiPort}`);
  });

  return app;
}

module.exports = { createServer };
