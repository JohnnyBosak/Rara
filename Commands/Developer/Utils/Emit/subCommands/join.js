const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  subCommand: "emit.join",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  execute(interaction, client) {
    client.emit("guildMemberAdd", interaction.member);
    return;

    //interaction.reply({content: "Emitted GuildMemberJoin", ephemeral: true});
  }
}
