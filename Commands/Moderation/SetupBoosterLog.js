const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");
const database = require("../../Schemas/BoosterLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup_booster_log")
    .setDescription("Configure boost logging system for your guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((options) => options
      .setName("announcement_channel")
      .setDescription("Select the announcement channel for the boost event.")
      .addChannelTypes(ChannelType.GuildText))
    .addChannelOption((options) => options
      .setName("log_channel")
      .setDescription("Select the logging channel for the boost event.")
      .addChannelTypes(ChannelType.GuildText)
    ),
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */

  async execute(interaction, client) {

    const announcementChannel = interaction.options.getChannel('announcement_channel') || null;
    const logChannel = interaction.options.getChannel('log_channel') || null;

    const guildConfigObject = {
      AnnouncementChannel: announcementChannel,
      logChannel: logChannel
    };

    await database.findOneAndUpdate(
      { Guild: interaction.guild.id },
      guildConfigObject,
      { new: true, upsert: true }
    );

    client.guildConfig.set(interaction.guild.id, guildConfigObject);


    const embed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle(`> Your Booster Channel Has \n Been Set Successfully!`)
      .setAuthor({ name: "Booster Channel" })
      .setFooter({ text: "Enjoy Using Booster" })
      .setTimestamp()
      .setThumbnail('https://cdn.discordapp.com/emojis/1085198386443075706.gif?size=96&quality=lossless')
      .addFields([
        { name: "Announcement channel was set", value: `The channel ${announcementChannel} has been set as your Booster channel.`, inline: false },
        { name: "Log channel was set", value: `The channel ${logChannel} has been set as your Booster channel.`, inline: false },
      ]);

    await interaction.reply({ embeds: [embed] });
  }
};
