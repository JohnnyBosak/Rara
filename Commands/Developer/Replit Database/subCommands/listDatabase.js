const { ChatInputCommandInteraction } = require("discord.js");
const db = require("@replit/database");
require('dotenv').config();
const config = require("../../../../config.json");

module.exports = {
  subCommand: "database.list",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const isBotDeveloper = interaction.user.id === config.Developer;

    if (!isBotDeveloper) {
      await interaction.reply("Only the bot developer can use this command.");
      return;
    }

    const keyToSearch = interaction.options.getString('key');
    const database = new db(process.env.REPLIT_DB_URL);

    try {
      const allKeysResponse = await database.list();
      const allKeys = allKeysResponse.value;

      if (!Array.isArray(allKeys) || allKeys.length === 0) {
        await interaction.reply("The database is empty.");
        return;
      }

      let keys;

      if (keyToSearch) {
        filteredKeys = allKeys.filter((key) => key.startsWith(keyToSearch));
        if (filteredKeys.length === 0) {
          await interaction.reply("No matching keys found in the database.");
          return;
        }
      } else {
        filteredKeys = allKeys;
      }

      const contents = {};

      for (const key of filteredKeys) {
        const value = await database.get(key);
        contents[key] = value;
      }

      const result = JSON.stringify(contents, null, 2);

      await interaction.reply(`\`\`\`JSON\nDatabase Contents:\n${result}\n\`\`\``);
    } catch (error) {
      console.error("Error listing database:", error);
      await interaction.reply("An error occurred while listing the database.");
    }
  },
};
