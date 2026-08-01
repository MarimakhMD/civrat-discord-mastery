// ═══════════════════════════════════════════════════
// EVENT: messageCreate - Anti-Spam, Counting
// ═══════════════════════════════════════════════════
// FIX: Memory leak in spam tracker fixed with timestamps.

const guildConfigService = require("../services/guildConfig");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Anti-spam tracking with timestamps (prevents memory leak)
const spamTracker = new Map();

// Counting game schema
const CountingGame = mongoose.models.CountingGame || mongoose.model("CountingGame", new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  lastNumber: { type: Number, default: 0 },
  lastUserId: { type: String, default: null },
  lastMessageTime: { type: Date, default: Date.now },
}));

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const config = await guildConfigService.getGuildConfig(message.guild.id);
    if (!config) return;

    await handleAntiSpam(message, config);
    await handleCounting(message, config);
  },
};

async function handleAntiSpam(message, config) {
  if (!config.automod_enabled || !config.automod_anti_spam) return;
  if (message.member?.permissions.has("Administrator")) return;

  const key = `${message.guild.id}:${message.author.id}`;
  if (!spamTracker.has(key)) spamTracker.set(key, []);

  const timestamps = spamTracker.get(key);
  timestamps.push(Date.now());

  const filtered = timestamps.filter((t) => Date.now() - t < 8000);
  spamTracker.set(key, filtered);

  // Cleanup old entries periodically
  if (filtered.length === 0) spamTracker.delete(key);

  if (filtered.length >= 5) {
    await message.member.timeout(300000, "Anti-spam").catch(() => {});
    message.channel.send(`${message.author} mute pour spam.`).catch(() => {});
    spamTracker.set(key, []);
  }
}

async function handleCounting(message, config) {
  // Counting channel - use config or fallback to original hardcoded ID
  const countingChannelId = "1490014117745004637"; // Original hardcoded
  if (message.channel.id !== countingChannelId) return;

  const number = parseInt(message.content.trim());
  if (isNaN(number)) {
    await message.delete().catch(() => {});
    return;
  }

  try {
    const game = await CountingGame.findOneAndUpdate(
      { guildId: message.guild.id },
      {},
      { new: true, upsert: true }
    );

    const expected = (game.lastNumber || 0) + 1;

    if (number !== expected) {
      await message.delete().catch(() => {});
      return;
    }

    if (message.author.id === game.lastUserId) {
      await message.delete().catch(() => {});
      return;
    }

    game.lastNumber = number;
    game.lastUserId = message.author.id;
    game.lastMessageTime = new Date();
    await game.save();

    await message.react("✅").catch(() => {});
  } catch (err) {
    logger.error("Counting error:", err.message);
  }
}
