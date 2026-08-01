// ═══════════════════════════════════════════════════
// DEPLOY COMMANDS - Registers slash commands with Discord
// ═══════════════════════════════════════════════════
// Run: node deploy.js
// FIX: Now reads from the same command files as the bot

require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { loadCommands } = require("./src/handlers/commandHandler");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ DISCORD_TOKEN or CLIENT_ID missing in .env");
  process.exit(1);
}

(async () => {
  try {
    const commands = loadCommands();
    const commandData = Array.from(commands.values()).map((c) => c.data.toJSON());

    console.log(`📦 Installing ${commandData.length} commands...`);

    const rest = new REST({ version: "10" }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commandData });

    console.log(`✅ ${commandData.length} commands installed globally!`);
    console.log("⏰ Note: Global commands may take up to 1 hour to appear.");
  } catch (error) {
    console.error("❌ Installation failed:", error);
  }
})();
