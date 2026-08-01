const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invites")
    .setDescription("Voir les invitations")
    .addUserOption((o) => o.setName("utilisateur").setDescription("Utilisateur").setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;

    // Read invite stats from the guild's invite tracking service
    const inviteService = require("../services/inviteService");
    const stats = await inviteService.getInviteStats(user.id, interaction.guild.id);

    const embed = new EmbedBuilder()
      .setColor("#00D4AA")
      .setTitle("📊 INVITES STATS")
      .setThumbnail(user.displayAvatarURL())
      .setDescription(
        `
━━━━━━━━━━━━━━━━━━━━━━
👤 **Utilisateur**
• ${user}

📊 **Invitations totales**
• ${stats.total}

📥 **Invitations actuelles**
• ${stats.current}

📤 **Membres partis**
• ${stats.left}
━━━━━━━━━━━━━━━━━━━━━━
`
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
