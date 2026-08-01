const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");

module.exports = {
  name: "roleUpdate", once: false,
  async execute(oldRole, newRole) {
    if (oldRole.name === newRole.name) return;
    const config = await guildConfigService.getGuildConfig(newRole.guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_role_update_channel_id;
    if (!channelId) return;
    const logChannel = newRole.client.channels.cache.get(channelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("#5865F2").setTitle("🔧 ROLE UPDATED")
      .setDescription(`🏷 **Avant** • ${oldRole.name}\n🏷 **Après** • ${newRole.name}`)
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  },
};
