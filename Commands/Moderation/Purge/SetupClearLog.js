const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");
const database = require("../../../Schemas/ClearLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup_clearlog")
    .setDescription("Configure the clear logging system for your guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((options) => options
      .setName("log_channel")
      .setDescription("Select the logging channel for this system.")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
    ),
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("log_channel").id;

    await database.findOneAndUpdate(
      { Guild: guild.id },
      { logChannel: logChannel },
      { new: true, upsert: true }
    );

    client.guildConfig.set(guild.id, { logChannel: logChannel });

    const Embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`- Clear Logging Channel Updated: <#${logChannel}>`);

    return interaction.reply({ embeds: [Embed] });
  }
}
