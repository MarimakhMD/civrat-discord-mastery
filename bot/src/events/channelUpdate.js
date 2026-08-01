const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");
const { fetchAuditLog } = require("../utils/auditLogCache");

module.exports = {
  name: "channelUpdate", once: false,
  async execute(oldChannel, newChannel) {
    if (!newChannel.guild || oldChannel.name === newChannel.name) return;
    const config = await guildConfigService.getGuildConfig(newChannel.guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_channel_update_channel_id;
    if (!channelId) return;
    const logChannel = newChannel.client.channels.cache.get(channelId);
    if (!logChannel) return;

    const entry = await fetchAuditLog(newChannel.guild, 11);
    const embed = new EmbedBuilder()
      .setColor("#5865F2").setTitle("🔧 CHANNEL UPDATED")
      .setDescription(`📍 **Avant** • ${oldChannel.name}\n📍 **Après** • ${newChannel.name}\n🛡 **Par** • ${entry?.executor || "Inconnu"}`)
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  },
};
