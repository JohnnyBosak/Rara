const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
  subCommand: "emoji.remove",
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

      const emoji = interaction.options.getString("emoji");
      const [, animated, name, id] = emoji.match(/<(a)?:([a-zA-Z0-9_]+):([0-9]+)>/) || [];
      
      // Find the emoji by name
      const findEmoji = await interaction.guild.emojis.fetch()
        .then(emojis => emojis.find(emoji => emoji.id === id));

      if (!findEmoji) {
        throw new Error(`Unable to find emoji.`);
      }
      
      await interaction.reply(`Emoji ${emoji} has been removed successfully.`);
      await findEmoji.delete();

    } catch (error) {
      console.error(error);
      interaction.reply({ content: error.message, ephermal: true });
    }
  }
};
