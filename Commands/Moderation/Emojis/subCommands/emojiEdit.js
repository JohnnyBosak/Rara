const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
  subCommand: "emoji.edit",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
        return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
      }
      
      if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
        throw new Error("I don't have permission to manage emojis!");
      }

      // Get emoji details from user input
      const emoji = interaction.options.getString("emoji");
      const newEmojiName = interaction.options.getString("new_name");

      const [, animated, name, id] = emoji.match(/<(a)?:([a-zA-Z0-9_]+):([0-9]+)>/) || [];

      // Find the emoji by name
      const findEmoji = await interaction.guild.emojis.fetch()
        .then(emojis => emojis.find(emoji => emoji.id === id));

      if (!findEmoji) {
        throw new Error(`Unable to find emoji.`);
      }

      // Edit the emoji name
      await findEmoji.edit({ name: newEmojiName });

      await interaction.reply(`Emoji ${emoji} has been renamed to ${newEmojiName} successfully.`);

    } catch (error) {
      console.error(error);
      interaction.reply({ content: error.message, ephemeral: true });
    }
  }
};
