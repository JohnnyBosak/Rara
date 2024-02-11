const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((subcommand) => subcommand
      .setName("message_log")
      .setDescription("Configure the messages logging system for your guild")
      .addChannelOption((options) => options
        .setName("deleted-messages")
        .setDescription("Set the channel where the deleted messages will be logged")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
      .addChannelOption((options) => options
        .setName("edited-messages")
        .setDescription("Set the channel where the edited messages will be logged")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
    )
    .addSubcommand((subcommand) => subcommand
      .setName("welcome")
      .setDescription("Configure the welcome member logging system for your guild")
      .addChannelOption((options) => options
        .setName("log_channel")
        .setDescription("Select the logging channel for this system.")
        .addChannelTypes(ChannelType.GuildText, ChannelType.PrivateThread)
      )
      .addRoleOption((options) => options
        .setName("member_role_add")
        .setDescription("Set the role to be automatically added to new members.")
      )
      .addRoleOption((options) => options
        .setName("bot_role_add")
        .setDescription("Set the role to be automatically added to new bots.")
      )
      .addChannelOption((options) => options
        .setName("welcome_channel")
        .setDescription("Select where the welcome message will be sent.")
        .addChannelTypes(ChannelType.GuildText)
      )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("clear_log")
      .setDescription("Configure the logging channel for the /clear command.")
      .addChannelOption((options) => options
        .setName("channel")
        .setDescription("Select the channel where cleared messaged by /clear command will be logged.")
        .addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand((subcommand) => subcommand
      .setName("booster")
      .setDescription("Configure boost logging system for your guild.")
      .addChannelOption((options) => options
        .setName("announcement_channel")
        .setDescription("Select the announcement channel for the boost event.")
        .addChannelTypes(ChannelType.GuildText))
      .addChannelOption((options) => options
        .setName("log_channel")
        .setDescription("Select the logging channel for the boost event.")
        .addChannelTypes(ChannelType.GuildText)
      )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("ban_log")
      .setDescription("Configure the logging channel for the ban/unban event.")
      .addChannelOption((options) => options
        .setName("channel")
        .setDescription("Select the channel where the ban/unban event will be logged.")
        .addChannelTypes(ChannelType.GuildText)
      )
    ),
};
