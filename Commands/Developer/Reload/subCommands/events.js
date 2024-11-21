const { ChatInputCommandInteraction, Client } = require("discord.js");
const { loadEvents } = require("../../../../Handlers/eventHandler");

module.exports = {
  subCommand: "reload.events",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  async execute(interaction, client) {
    try {
      for (const [key, value] of client.events) {
        client.removeListener(`${key}`, value, true);
      }
      loadEvents(client);
      await interaction.reply({ content: "Reloaded the events.", ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while reloading events.', ephemeral: true });
    }
  },
};