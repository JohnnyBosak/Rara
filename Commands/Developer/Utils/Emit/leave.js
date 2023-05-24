const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  subCommand: "emit.leave",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  execute(interaction, client) {
    client.emit("guildMemberRemove", interaction.member);

    interaction.reply({content: "Emitted GuildMemberLeft", ephemeral: true});
  }
}