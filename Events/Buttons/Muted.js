const { ButtonInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /** 
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.guild) return;
    if (!interaction.message) return;
    if (!interaction.isButton) return;

    if (interaction.customId == 'close_ticket') {
      const thread = interaction.message.channel;
      try {
        await interaction.reply('Closing the ticket...');

        //await thread.delete();
        await thread.edit({
          name: `[Closed] ${thread.name}`,
          locked: true
        });
        await thread.members.remove(interaction.user.id);

        //await interaction.message.edit({ components: [] });
      } catch (error) {
        console.error(error);
      }
    }
  },
};
