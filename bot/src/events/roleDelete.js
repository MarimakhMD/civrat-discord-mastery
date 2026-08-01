const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");

module.exports = {
  name: "roleDelete", once: false,
  async execute(role) {
    const config = await guildConfigService.getGuildConfig(role.guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_role_update_channel_id;
    if (!channelId) return;
    const logChannel = role.client.channels.cache.get(channelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("#ED4245").setTitle("🗑 ROLE DELETED")
      .setDescription(`🏷 **Nom** • ${role.name}\n🆔 **ID** • ${role.id}`)
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  },
};
