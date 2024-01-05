const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji")
    .setDescription("Manage, list, add, edit, remove, or mix server emojis")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .addSubcommand((subcommand) => subcommand
      .setName("mixer")
      .setDescription("Combine two different emojis")
      .addStringOption(options => options
        .setName("emojis")
        .setDescription("The emojis to combine")
        .setRequired(true)
      )
      .addStringOption(options => options
        .setName("size")
        .setDescription("Emoji dimension")
        .setRequired(false)
        .addChoices(
          { name: 'Emote', value: '64' },
          { name: 'Large emote', value: '128' },
          { name: 'Sticker', value: '320' },
          { name: 'Image (default)', value: '534' })
      )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("list")
      .setDescription("List all emojis in the server")
    )
    .addSubcommand((subcommand) => subcommand
      .setName("add")
      .setDescription("Add an emoji to the server")
      .addStringOption((options) => options
        .setName("url")
        .setDescription("Provide the URL of the emoji you want to add.")
        .setRequired(true)
      )
      .addStringOption((options) => options
        .setName("name")
        .setDescription("Provide the name of the emoji you want to add.")
        .setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand
      .setName("remove")
      .setDescription("Remove an emoji from the server")
      .addStringOption((options) => options
        .setName("emoji")
        .setDescription("Provide the emoji you want to remove.")
        .setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand
      .setName("edit")
      .setDescription("Edit the name of an emoji")
      .addStringOption((options) => options
        .setName("emoji")
        .setDescription("Provide the emoji you want to edit.")
        .setRequired(true)
      )
      .addStringOption((options) => options
        .setName("new_name")
        .setDescription("Provide the new name of the emoji.")
        .setRequired(true))
    ),
};
