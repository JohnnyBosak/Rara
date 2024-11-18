const { ChatInputCommandInteraction, Client } = require("discord.js");
const { loadCommands } = require("../../../../Handlers/commandHandler");

module.exports = {
  subCommand: "reload.commands",
  /** 
  * Executes the reload commands subcommand.
  *
  * @param {ChatInputCommandInteraction} interaction - The interaction object.
  * @param {Client} client - The Discord client.
  */
  async execute(interaction, client) {
    await loadCommands(client);
    loadCommands(client);
    interaction.reply({content: "Reloaded the commands.", ephemeral: true});
  },
};