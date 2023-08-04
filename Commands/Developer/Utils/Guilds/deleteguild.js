const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("delete-server")
    .setDescription("Delete a server")
    .setDMPermission(true)
    .addStringOption((options) => options
      .setName("id")
      .setDescription("Guild ID")
      .setRequired(true)
    ),

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
