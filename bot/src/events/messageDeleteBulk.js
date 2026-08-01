const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");

module.exports = {
  name: "messageDeleteBulk", once: false,
  async execute(messages) {
    if (!messages.first()?.guild) return;
    const config = await guildConfigService.getGuildConfig(messages.first().guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_message_delete_channel_id;
    if (!channelId) return;
    const channel = messages.first().client.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#FAA61A").setTitle("🧹 BULK DELETE")
      .setDescription(`📍 **Salon** • ${messages.first().channel}\n🗑 **Messages supprimés** • ${messages.size}`)
      .setTimestamp();
    channel.send({ embeds: [embed] });
  },
};
