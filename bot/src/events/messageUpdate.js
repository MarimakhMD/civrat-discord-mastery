const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");

module.exports = {
  name: "messageUpdate", once: false,
  async execute(oldMessage, newMessage) {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    if (!oldMessage.content && !newMessage.content) return;

    const config = await guildConfigService.getGuildConfig(oldMessage.guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_message_edit_channel_id;
    if (!channelId) return;
    const channel = oldMessage.client.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#5865F2").setTitle("✏️ MESSAGE EDITED")
      .setThumbnail(oldMessage.author.displayAvatarURL())
      .setDescription(`👤 **Auteur** • ${oldMessage.author}\n📍 **Salon** • ${oldMessage.channel}\n🔗 [Aller au message](${newMessage.url})\n📝 **Avant**\n\`\`\`\n${(oldMessage.content || "").slice(0, 500)}\n\`\`\`\n📝 **Après**\n\`\`\`\n${(newMessage.content || "").slice(0, 500)}\n\`\`\``)
      .setTimestamp();
    channel.send({ embeds: [embed] });
  },
};
