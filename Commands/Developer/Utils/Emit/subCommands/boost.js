const { ChatInputCommandInteraction, Collection, Client } = require("discord.js");

module.exports = {
  subCommand: "emit.boost",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  execute(interaction, client) {
    const oldMember = interaction.guild.members.cache.get('408675103946178561');
    const newMember = interaction.guild.members.cache.get('772939602863587368');

    client.emit("guildMemberUpdate", oldMember, newMember);
    
    interaction.reply({ content: "Emitted guildMemberUpdate", ephemeral: true });
  }
};
