const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute un membre")
    .addUserOption((o) => o.setName("utilisateur").setDescription("Utilisateur").setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("utilisateur");
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: "❌ Membre introuvable.", ephemeral: true });
    }

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({ content: "❌ Ce membre n'est pas mute.", ephemeral: true });
    }

    await member.timeout(null, "Unmute");
    return interaction.reply(`🔊 ${user.tag} a été unmute.`);
  },
};
