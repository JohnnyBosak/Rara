const { ChatInputCommandInteraction } = require("discord.js");
const db = require("@replit/database");
const config = require("../../../../config.json");

module.exports = {
  subCommand: "database.list",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    // Check if the user is the bot developer
    const isBotDeveloper = interaction.user.id === config.Developer;

    if (!isBotDeveloper) {
      await interaction.reply("Only the bot developer can use this command.");
      return;
    }

    const database = new db();

    try {
      const keys = await database.list();

      if (keys.length === 0) {
        await interaction.reply("The database is empty.");
        return;
      }

      const contents = {};

      for (const key of keys) {
        const value = await database.get(key);
        contents[key] = value;
      }

      const result = JSON.stringify(contents, null, 3);

      await interaction.reply(`\`\`\`JSON\nDatabase Contents:\n${result}\n\`\`\``);
    } catch (error) {
      console.error("Error listing database:", error);
      await interaction.reply("An error occurred while listing the database.");
    }
  },
};
