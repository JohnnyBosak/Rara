const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require(`discord.js`);
const ms = require("ms");
const { mongoose } = require(`mongoose`);

module.exports = {
  subCommand: "giveaway.end",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
            // END GIVEAWAY CODE //
            await interaction.reply({
          content: `**Ending** your giveaway..`,
          ephemeral: true,
        });

        const messageId1 = interaction.options.getString("message-id");
        client.giveawayManager
          .end(messageId1)
          .then(() => {
            interaction.followUp({
              content: "Your **giveaway** has ended **successfuly!**",
              ephemeral: true,
            });
          })
          .catch((err) => {
            interaction.followUp({
              content: `An **error** occured! Please contact **𝔍𝔬𝔥𝔫𝔫𝔶#1999** if this issue continues. \n> **Error**: ${err}`,
              ephemeral: true,
            });
          });

  }
}