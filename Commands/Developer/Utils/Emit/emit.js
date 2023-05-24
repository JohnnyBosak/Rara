const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
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
    .setDescription("Emit leaving message")),
}