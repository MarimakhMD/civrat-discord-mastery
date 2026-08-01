const guildConfigService = require("../services/guildConfig");
const { fetchAuditLog } = require("../utils/auditLogCache");
const { sendLog } = require("../services/logService");
module.exports = { name: "channelDelete", once: false, async execute(channel) { try { if (!channel.guild) return; const config = await guildConfigService.getGuildConfig(channel.guild.id); if (!config.logs_enabled) return; const entry = await fetchAuditLog(channel.guild, 12); await sendLog(channel.guild, config, "log_channel_update_channel_id", { title: "🗑 Salon supprimé", color: "danger", moderator: entry?.executor, fields: [{ name: "Nom", value: channel.name || "Inconnu", inline: true }, { name: "ID", value: channel.id, inline: true }] }); } catch {} } };
