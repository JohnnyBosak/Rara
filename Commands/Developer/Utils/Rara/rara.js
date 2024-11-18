const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("rara")
        .setDescription("Manage Rara's profile")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(ContextTypes.Guild, ContextTypes.DM)
        .addSubcommand((options) =>
            options
            .setName("avatar")
            .setDescription("Change Rara's avatar")
            .addStringOption(options =>
                options
                .setName('url')
                .setDescription('URL of the new avatar')
                .setRequired(true)
            ))
        .addSubcommand((options) =>
            options
            .setName("banner")
            .setDescription("Change Rara's banner")
            .addStringOption((options) =>
                options
                .setName('url')
                .setDescription('URL of the new banner')
                .setRequired(true)
            ))
        .addSubcommandGroup((options) =>
            options
            .setName("emoji")
            .setDescription("Manage Rara's emojis")
            .addSubcommand((options) =>
                options
                .setName("create")
                .setDescription("Create a new emoji")
                .addAttachmentOption((options) =>
                    options
                    .setName("emoji")
                    .setDescription("The emoji to upload")
                    .setRequired(true)
                )
                .addStringOption((options) =>
                    options
                    .setName('name')
                    .setDescription('Name of the emoji to upload')
                    .setRequired(true)
                ))
            .addSubcommand((options) =>
                options
                .setName("remove")
                .setDescription("Remove an existing emoji")
                .addStringOption((options) =>
                    options
                    .setName('id')
                    .setDescription('ID of the emoji to remove')
                    .setRequired(true)
                ))
            .addSubcommand((options) =>
                options
                .setName("get")
                .setDescription("List all Rara's emojis"))
        ),
};