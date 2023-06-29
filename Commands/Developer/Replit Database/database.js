const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("Replit Database settings")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((command) => command
      .setName('list')
      .setDescription('Lists the contents of the Replit Database')
    )
    .addSubcommand((command) => command
      .setName('clear')
      .setDescription('Clears the contents of the Replit Database')
      .addStringOption((option) => option
        .setName('key')
        .setDescription('Specify the key to delete from the database')
      )
    ),
};
