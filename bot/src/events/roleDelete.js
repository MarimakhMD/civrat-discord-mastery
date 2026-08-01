const guildConfigService = require("../services/guildConfig");
const { sendLog } = require("../services/logService");
module.exports = { name: "roleDelete", once: false, async execute(role) { try { const config = await guildConfigService.getGuildConfig(role.guild.id); if (config.logs_enabled) await sendLog(role.guild, config, "log_role_update_channel_id", { title: "🗑 Rôle supprimé", color: "danger", fields: [{ name: "Nom", value: role.name || "—", inline: true }, { name: "ID", value: role.id, inline: true }] }); } catch {} } };
