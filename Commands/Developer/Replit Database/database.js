const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("Replit database settings")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((command) => command
      .setName('list')
      .setDescription('Lists the contents of the Replit Database')
      .addStringOption((option) => option
        .setName('key')
        .setDescription('Specify the key to search in the database')
      )
    )
    .addSubcommand((command) => command
      .setName('set')
      .setDescription('Sets a JSON object in the Replit Database under a specified name')
      .addStringOption((option) => option
        .setName('name')
        .setDescription('Set a name for your data to be stored in the database')
        .setRequired(true)
      )
      .addStringOption((option) => option
        .setName('settings')
        .setDescription('In JSON format')
        .setRequired(true)
      )
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
