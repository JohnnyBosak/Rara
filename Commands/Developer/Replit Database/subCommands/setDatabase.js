const { ChatInputCommandInteraction } = require("discord.js");
const db = require("@replit/database");
const config = require("../../../../config.json");

module.exports = {
  subCommand: "database.set",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    // Check if the user is the bot developer
    if (interaction.user.id !== config.Developer) {
      await interaction.reply("Only the bot developer can use this command.");
      return;
    }

    const key = interaction.options.getString('key');
    const value = interaction.options.getString('value') || null;

    if (!key) {
      await interaction.reply("Please provide a key.");
      return;
    }
    
    const database = new db();

    try {
      const parsedValue = JSON.parse(value);
    
      await database.set(key, parsedValue);
     
      const contents = {};
      contents[key] = parsedValue;
      const result = JSON.stringify(contents, null, 3);

      await interaction.reply(`The key \`${key}\` has been set in the database.\n\`\`\`JSON\nDatabase Contents:\n${result}\n\`\`\``);
    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        await interaction.reply("Please provide a valid JSON value.");
      } else {
      console.error("Error setting value in the database:", error);
      await interaction.reply("An error occurred while setting the database.");
      }
    }
  },
};
