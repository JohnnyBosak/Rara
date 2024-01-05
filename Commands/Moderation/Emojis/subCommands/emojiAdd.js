const { ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "emoji.add",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    try {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
        return interaction.editReply({ content: "You don't have permission to use this command.", ephemeral: true });
      }

      if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
        return interaction.editReply("I don't have permission to manage emojis!");
      }

      const url = interaction.options.getString("url");
      const name = interaction.options.getString("name");

      const newEmoji = await interaction.guild.emojis.create({ attachment: url, name: name });

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`Added ${newEmoji}, with the name ${name}`)
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {

      if (error.code === 50035 && error.message.includes("image[IMAGE_INVALID]:")) {
        interaction.editReply({ content: "Invalid image data. Please provide a valid url.", ephemeral: true })
      } else if (error.code === 30008) {
        interaction.editReply({ content: error.rawError.message })
      } else {
        console.log(error);
        interaction.editReply({ content: error.message })
      }
    }
  }
};
