// ═══════════════════════════════════════════════════
// API SERVER - Express for dashboard health checks
// ═══════════════════════════════════════════════════

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { config } = require("../config");
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

  // Force config reload
  app.post("/api/guilds/:guildId/sync", (req, res) => {
    const guildConfigService = require("../services/guildConfig");
    guildConfigService.invalidateCache(req.params.guildId);
    res.json({ success: true, message: "Cache invalidated" });
  });

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));

  app.listen(config.apiPort, () => {
    logger.success(`API server running on port ${config.apiPort}`);
  });

  return app;
}

module.exports = { createServer };
