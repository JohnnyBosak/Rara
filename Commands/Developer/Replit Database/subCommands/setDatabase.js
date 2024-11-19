const { ChatInputCommandInteraction, AttachmentBuilder } = require("discord.js");
const db = require("@replit/database");
require('dotenv').config();
const config = require("../../../../config.json");
const fs = require('fs');

module.exports = {
  subCommand: "database.set",
  /**
   *
   * @param  {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.user.id !== config.Developer) {
      await interaction.reply("Only the bot developer can use this command.");
      return;
    }

    const jsonName = interaction.options.getString("name");
    const jsonString = interaction.options.getString("settings");

    const database = new db(process.env.REPLIT_DB_URL);

    try {
      const parsedJson = JSON.parse(jsonString);

      await database.set(jsonName, parsedJson);

      const fileName = `${jsonName}.json`;
      const filePath = `./${fileName}`;
      fs.writeFileSync(filePath, JSON.stringify(parsedJson, null, 2));

      const file = new AttachmentBuilder(filePath);

      const result = JSON.stringify(parsedJson, null, 2);

      await interaction.reply({
        content: `\`${jsonName}\` has been set in the database with the following data:\n`,
        files: [file],
    });

    fs.unlinkSync(filePath);

    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        await interaction.reply("The provided string is not valid JSON. Please check and try again.");
      } else {
        console.error("Error setting value in the database:", error);
        await interaction.reply("An error occurred while setting the database. Please try again.");
      }
    }
  },
};