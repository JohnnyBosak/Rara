const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");
const database = require("../../Schemas/MemberLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup_memberlog")
    .setDescription("Configure the welcome member logging system for your guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((options) => options
      .setName("log_channel")
      .setDescription("Select the logging channel for this system.")
      .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((options) => options
      .setName("member_role")
      .setDescription("Set the role to be automatically added to new members.")
    )
    .addRoleOption((options) => options
      .setName("bot_role")
      .setDescription("Set the role to be automatically added to new bots.")
    )
    .addChannelOption((options) => options
      .setName("welcome_channel")
      .setDescription("Select the welcome channel for this system.")
      .addChannelTypes(ChannelType.GuildText)
    ),
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("log_channel")?.id || null;
    const memberRole = options.getRole("member_role")?.id || null;
    const botRole = options.getRole("bot_role")?.id || null;
    const welcomeChannel = options.getChannel("welcome_channel")?.id || null;

    const guildConfigObject = {
      logChannel: logChannel,
      memberRole: memberRole,
      botRole: botRole,
      welcomeChannel: welcomeChannel
    };

    await database.findOneAndUpdate(
      { Guild: guild.id },
      guildConfigObject,
      { new: true, upsert: true }
    );

    client.guildConfig.set(guild.id, guildConfigObject);

    const Embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({ name: "Welcome system", iconURL: "https://media.discordapp.net/attachments/430778195789348874/1138012783993163807/welcome.gif" })
      .setDescription([
        `- Member Logging Channel Updated: ${logChannel ? `<#${logChannel}>` : "Not Specified."}`,
        `- Member Auto-Role Updated: ${memberRole ? `<@&${memberRole}>` : "Not Specified."}`,
        `- Bot Auto-Role Updated: ${botRole ? `<@&${botRole}>` : "Not Specified."}`,
        `- Welcome channel Updated: ${welcomeChannel ? `<#${welcomeChannel}>` : "Not Specified."}`
      ].join("\n"));

    return interaction.reply({ embeds: [Embed] });
  }
}
