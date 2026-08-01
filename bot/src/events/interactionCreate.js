// ═══════════════════════════════════════════════════
// EVENT: interactionCreate - Handles all interactions
// ═══════════════════════════════════════════════════

const {
  EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,
  ButtonBuilder, ButtonStyle, ChannelType,
} = require("discord.js");
const commandHandler = require("../handlers/commandHandler");
const guildConfigService = require("../services/guildConfig");
const logger = require("../utils/logger");

module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      return commandHandler.handleCommand(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "ticket_create") return handleTicketCreate(interaction);
      if (interaction.customId === "ticket_options") return handleTicketClose(interaction);
    }

    if (interaction.isButton()) {
      if (interaction.customId === "reopen") return handleTicketReopen(interaction);
      if (interaction.customId === "delete") return handleTicketDelete(interaction);
    }
  },
};

async function handleTicketCreate(interaction) {
  try {
    const config = await guildConfigService.getGuildConfig(interaction.guild.id);

    // Get ticket counter from MongoDB
    const mongoose = require("mongoose");
    const TicketCounter = mongoose.models.TicketCounter || mongoose.model("TicketCounter", new mongoose.Schema({
      guildId: { type: String, required: true, unique: true },
      counter: { type: Number, default: 0 },
    }));

    const ticketDoc = await TicketCounter.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $inc: { counter: 1 } },
      { new: true, upsert: true }
    );

    const number = String(ticketDoc.counter).padStart(2, "0");
    const isGame = interaction.values[0] === "game";

    // Use config or fallback to name-based search
    const categoryId = isGame ? config.ticket_category_id : config.ticket_category_id;
    const staffRoleId = config.ticket_support_role_id;

    let category = categoryId ? interaction.guild.channels.cache.get(categoryId) : null;
    if (!category) {
      const categoryName = isGame ? "🎮 TICKETS-JEU" : "💬 TICKETS-DISCORD";
      category = interaction.guild.channels.cache.find(
        (c) => c.name === categoryName && c.type === ChannelType.GuildCategory
      );
    }

    if (!category) {
      return interaction.reply({ content: "❌ Catégorie de tickets introuvable.", ephemeral: true });
    }

    // Check duplicate ticket
    const existingTicket = interaction.guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildText && c.parentId === category.id && c.topic === interaction.user.id
    );
    if (existingTicket) {
      return interaction.reply({ content: `❌ Vous avez déjà un ticket : ${existingTicket}`, ephemeral: true });
    }

    const overwrites = [
      { id: interaction.guild.id, deny: ["ViewChannel"] },
      { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] },
    ];
    if (staffRoleId) {
      overwrites.push({ id: staffRoleId, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] });
    }

    const channel = await interaction.guild.channels.create({
      name: `🎫・${number}`,
      type: ChannelType.GuildText,
      parent: category.id,
      topic: interaction.user.id,
      permissionOverwrites: overwrites,
    });

    const embed = new EmbedBuilder()
      .setTitle("🎫 Nouveau Ticket")
      .setColor(config.ticket_panel_color || "#5865F2")
      .setDescription(
        `👤 **Owner**\n${interaction.user}\n\n🛡 **Staff**\n${staffRoleId ? `<@&${staffRoleId}>` : "Staff"}\n\n📅 **Date**\n${new Date().toLocaleString("fr-FR")}\n\n🔢 **Numéro**\n${number}\n\n📂 **Section**\n${isGame ? "In-Game" : "Discord"}`
      )
      .setImage("https://i.imgur.com/SOP0RVR.png");

    const options = new StringSelectMenuBuilder()
      .setCustomId("ticket_options")
      .setPlaceholder("Actions du ticket...")
      .addOptions([{ label: "Fermer le ticket", value: "close", emoji: "🔒" }]);

    const row = new ActionRowBuilder().addComponents(options);

    await channel.send({
      content: `${interaction.user} ${staffRoleId ? `<@&${staffRoleId}>` : ""}`,
      embeds: [embed],
      components: [row],
    });

    await channel.send(
      `Bienvenue ${interaction.user} 👋\nUn membre du staff va vous répondre rapidement.`
    );

    // Log
    const logChannelId = config.ticket_log_channel_id || config.log_moderation_channel_id;
    if (logChannelId) {
      const logChannel = interaction.client.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor("#57F287").setTitle("🎫 TICKET CREATED")
          .setThumbnail(interaction.user.displayAvatarURL())
          .setDescription(`👤 **Par** ${interaction.user}\n📍 **Ticket** ${channel}\n📂 **Type** ${isGame ? "In-Game" : "Discord"}`)
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] });
      }
    }

    return interaction.reply({ content: `✅ Ticket créé : ${channel}`, ephemeral: true });
  } catch (err) {
    logger.error("Ticket creation failed:", err);
    return interaction.reply({ content: "❌ Erreur lors de la création du ticket.", ephemeral: true });
  }
}

async function handleTicketClose(interaction) {
  await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("reopen").setLabel("Réouvrir").setStyle(ButtonStyle.Success).setEmoji("🔓"),
    new ButtonBuilder().setCustomId("delete").setLabel("Supprimer").setStyle(ButtonStyle.Danger).setEmoji("🗑️")
  );

  await interaction.channel.send({ content: `🔒 Ticket fermé par ${interaction.user}`, components: [row] });
  return interaction.reply({ content: "🔒 Ticket fermé.", ephemeral: true });
}

async function handleTicketReopen(interaction) {
  await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: true });
  return interaction.reply({ content: "🔓 Ticket réouvert.", ephemeral: true });
}

async function handleTicketDelete(interaction) {
  await interaction.reply({ content: "🗑️ Suppression dans 3 secondes...", ephemeral: true });
  setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
}
