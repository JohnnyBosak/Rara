const { ChatInputCommandInteraction, MessageButton } = require("discord.js");
const db = require("@replit/database");
require('dotenv').config();
const config = require("../../../../config.json");

module.exports = {
  subCommand: "database.clear",
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

    const keyToDelete = interaction.options.getString('key');
    if (keyToDelete) {
      const database = new db(process.env.REPLIT_DB_URL);

      try {
        const value = await database.get(keyToDelete);

        if (value !== null && value !== undefined) {
          await database.delete(keyToDelete);
          await interaction.reply(`The key '${keyToDelete}' has been deleted from the database.`);
        } else {
          await interaction.reply(`The key '${keyToDelete}' does not exist in the database.`);
        }
      } catch (error) {
        console.error("Error deleting the key from the database:", error);
        await interaction.reply("An error occurred while deleting the key from the database.");
      }
    } else {

      const row = {
        type: 1,
        components: [
          {
            type: 2,
            style: 3,
            label: "Yes",
            custom_id: "confirmClear",
            disabled: false, // Enable the button initially
          },
          {
            type: 2,
            style: 4,
            label: "No",
            custom_id: "cancelClear",
            disabled: false, // Enable the button initially
          },
        ],
      };

      const reply = await interaction.reply({
        content: "Are you sure you want to clear the database?",
        components: [row],
      });

      const filter = (i) => {
        // Check if the user is the bot developer
        const isBotDeveloperReaction = i.user.id === config.Developer;

        // Return true only if the user is the bot developer
        return isBotDeveloperReaction;
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 10000, // 10 seconds
        max: 1,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "confirmClear") {
          await i.deferUpdate();

          const database = new db();

          try {
            await database.empty();
            await i.editReply("The database has been cleared.");
          } catch (error) {
            console.error("Error clearing the database:", error);
            await i.editReply("An error occurred while clearing the database.");
          }
        } else if (i.customId === "cancelClear") {
          await i.deferUpdate();
          await i.editReply("Database clear operation cancelled.");
        }

        // Remove the buttons
        await reply.edit({ components: [] });

        // Stop the collector
        collector.stop();
      });

      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await reply.edit({
            content: "Database clear operation timed out.",
            components: [],
          });
        }
      });
    }
  },
};
