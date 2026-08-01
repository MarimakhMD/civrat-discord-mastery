const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");
const { fetchAuditLog } = require("../utils/auditLogCache");

module.exports = {
  name: "channelDelete", once: false,
  async execute(channel) {
    if (!channel.guild) return;
    const config = await guildConfigService.getGuildConfig(channel.guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_channel_update_channel_id;
    if (!channelId) return;
    const logChannel = channel.client.channels.cache.get(channelId);
    if (!logChannel) return;

    const entry = await fetchAuditLog(channel.guild, 12);
    const embed = new EmbedBuilder()
      .setColor("#ED4245").setTitle("🗑 CHANNEL DELETED")
      .setDescription(`📍 **Nom** • ${channel.name}\n🛡 **Par** • ${entry?.executor || "Inconnu"}`)
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  },
};
