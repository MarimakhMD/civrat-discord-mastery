// ═══════════════════════════════════════════════════
// EVENT: guildMemberRemove - Goodbye, Kick Detection, Invite Decrement
// ═══════════════════════════════════════════════════
// FIX: Original had 2 separate listeners. Now merged.

const { EmbedBuilder } = require("discord.js");
const guildConfigService = require("../services/guildConfig");
const inviteService = require("../services/inviteService");
const placeholder = require("../services/placeholder");
const { fetchAuditLog } = require("../utils/auditLogCache");
const logger = require("../utils/logger");

module.exports = {
  name: "guildMemberRemove",
  once: false,

  async execute(member) {
    const config = await guildConfigService.getGuildConfig(member.guild.id);
    if (!config) return;

    await handleGoodbye(member, config);
    await handleLeaveLog(member, config);
    await handleKickDetection(member, config);
    await handleInviteDecrement(member, config);
  },
};

async function handleGoodbye(member, config) {
  if (!config.goodbye_enabled) return;

  // Fallback: find by name (original behavior)
  const channelId = config.goodbye_channel_id;
  let channel = channelId ? member.guild.channels.cache.get(channelId) : null;

  if (!channel) {
    channel = member.guild.channels.cache.find((c) => c.name === "「👋」au-revoir");
  }
  if (!channel) return;

  try {
    const message = placeholder.parse(config.goodbye_message, {
      user: member.user,
      member,
      guild: member.guild,
    });

    if (config.goodbye_embed_enabled) {
      const embed = new EmbedBuilder()
        .setColor(config.goodbye_embed_color || "#ED4245")
        .setDescription(message)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();
      channel.send({ embeds: [embed] });
    } else {
      channel.send(message);
    }
  } catch (err) {
    logger.error(`Goodbye failed for ${member.user.tag}:`, err.message);
  }
}

async function handleLeaveLog(member, config) {
  if (!config.logs_enabled) return;
  const channelId = config.log_member_leave_channel_id;
  if (!channelId) return;

  const channel = member.client.channels.cache.get(channelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#ED4245")
    .setTitle("📤 MEMBER LEFT")
    .setThumbnail(member.user.displayAvatarURL())
    .setDescription(
      `━━━━━━━━━━━━━━━━━━━━━━\n👤 **Membre** • ${member.user.tag}\n🆔 **ID** • ${member.id}\n📆 **Compte créé** • <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n👥 **Membres restants** • ${member.guild.memberCount}\n━━━━━━━━━━━━━━━━━━━━━━`
    )
    .setFooter({ text: member.guild.name })
    .setTimestamp();

  channel.send({ embeds: [embed] });
}

async function handleKickDetection(member, config) {
  if (!config.logs_enabled) return;
  const channelId = config.log_moderation_channel_id;
  if (!channelId) return;

  const channel = member.client.channels.cache.get(channelId);
  if (!channel) return;

  setTimeout(async () => {
    try {
      const entry = await fetchAuditLog(member.guild, 20); // MEMBER_KICK
      if (!entry || entry.target.id !== member.id) return;

      const embed = new EmbedBuilder()
        .setColor("#FAA61A")
        .setTitle("👢 MEMBER KICKED")
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(
          `━━━━━━━━━━━━━━━━━━━━━━\n👤 **Membre** • ${member.user.tag}\n🆔 **ID** • ${member.id}\n🛡 **Modérateur** • ${entry.executor}\n📋 **Raison** • ${entry.reason || "Aucune"}\n━━━━━━━━━━━━━━━━━━━━━━`
        )
        .setTimestamp();

      channel.send({ embeds: [embed] });
    } catch {}
  }, 1500);
}

async function handleInviteDecrement(member, config) {
  if (!config.invitations_enabled) return;
  if (member.user.bot) return;

  try {
    const mongoose = require("mongoose");
    const InviteStats = mongoose.models.InviteStats || mongoose.model("InviteStats");
    const userData = await InviteStats.findOne({ userId: member.id, guildId: member.guild.id });

    if (userData?.invitedBy) {
      await inviteService.removeInvite(userData.invitedBy, member.guild.id);
    }
  } catch {}
}
