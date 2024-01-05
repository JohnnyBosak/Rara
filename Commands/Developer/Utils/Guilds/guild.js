const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("guild")
    .setDescription("List/create/delete servers")
    .setDMPermission(true)
    .addSubcommand((subcommand) => subcommand
      .setName('list')
      .setDescription('Lists all guilds Rara is in')
    )
    .addSubcommand((subcommand) => subcommand
      .setName('create')
      .setDescription('Create a server')
    )
  .addSubcommand((subcommand) => subcommand
    .setName('delete')
    .setDescription('Delete a server')
    .addStringOption((option) => option
      .setName("id")
      .setDescription("Guild ID")
      .setRequired(true)
    )
  ),
};
