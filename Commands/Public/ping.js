const { chatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Will respond with pong."),
  /** 
  *
  * @param {chatInputCommandInteraction} interaction
  */
  execute(interaction, client) {
  interaction.reply({content: `pong! *${Math.round(client.ws.ping)}ms*`, ephemeral: true});
  }
}