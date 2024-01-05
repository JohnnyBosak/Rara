const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  subCommand: "guild.delete",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    await interaction.deferReply();

    const DoNotDeleteGuilds = ["429089094690275338", "881899387419258921", "794346100534411315"];

    const guild = await client.guilds.cache.get(interaction.options.getString("id"));
    if (!guild) {
      return interaction.editReply({ content: "Guild not found. Please make sure the provided Guild ID is correct." });
    }

    if (DoNotDeleteGuilds.includes(guild.id)) {
      return interaction.editReply({ content: "Cannot delete Leisha, Johnny and Grom servers." });
    }

    await guild.delete();
    interaction.editReply({ content: "Server deleted." });
  },
};
