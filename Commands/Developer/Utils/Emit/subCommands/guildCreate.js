const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  subCommand: "emit.rara_invited",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  async execute(interaction, client) {
    const guild = await interaction.guild.fetch();
    client.emit("guildCreate", guild);

    interaction.reply({content: "Emitted GuildCreate", ephemeral: true});
  }
}
