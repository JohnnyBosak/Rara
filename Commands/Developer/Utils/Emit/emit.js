const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
  .setName("emit")
  .setDescription("Emit the guildMemberJoin/Left events.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDMPermission(false)
  .addSubcommand((options) => 
    options
    .setName("join")
    .setDescription("Emit joining message"))
  .addSubcommand((options) => 
    options
    .setName("leave")
    .setDescription("Emit leaving message"))
  .addSubcommand((options) => 
    options
    .setName("boost")
    .setDescription("Emit boost message announcement"))
  .addSubcommand((options) =>
    options
    .setName("rara_invited")
    .setDescription("Emit rara_invited message"))                 
  ,
};
