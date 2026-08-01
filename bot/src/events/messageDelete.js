const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");
const { fetchAuditLog } = require("../utils/auditLogCache");

module.exports = {
  name: "messageDelete", once: false,
  async execute(message) {
    if (!message.guild || !message.author || message.author.bot) return;
    const config = await guildConfigService.getGuildConfig(message.guild.id);
    if (!config?.logs_enabled) return;
    const channelId = config.log_message_delete_channel_id;
    if (!channelId) return;
    const channel = message.client.channels.cache.get(channelId);
    if (!channel) return;

    let deletedBy = "Inconnu (auteur)";
    try {
      const entry = await fetchAuditLog(message.guild, 72);
      if (entry && Date.now() - entry.createdTimestamp < 5000 && entry.target.id === message.author.id) {
        deletedBy = `${entry.executor}`;
      }
    } catch {}

    const embed = new EmbedBuilder()
      .setColor("#ED4245").setTitle("🗑 MESSAGE DELETED")
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`👤 **Auteur** • ${message.author}\n📍 **Salon** • ${message.channel}\n🛡 **Supprimé par** • ${deletedBy}\n💬 **Contenu**\n\`\`\`\n${(message.content || "Aucun contenu").slice(0, 1000)}\n\`\`\``)
      .setTimestamp();
    channel.send({ embeds: [embed] });
  },
};
