const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  subCommand: "emit.boost",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  execute(interaction, client) {
    client.emit("guildMemberUpdate", interaction.member);
    return;

    //interaction.reply({content: "Emitted guildMemberUpdate", ephemeral: true});
  }
}
