const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require(`discord.js`);
const ms = require("ms");
const { mongoose } = require(`mongoose`);

module.exports = {
  subCommand: "giveaway.reroll",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
            // REROLL GIVEAWAY CODE //

        await interaction.reply({
          content: `**Rerolling** your giveaway..`,
          ephemeral: true,
        });

        const query = interaction.options.getString("message-id");
        const giveaway =
          client.giveawayManager.giveaways.find(
            (g) => g.guildId === interaction.guildId && g.prize === query
          ) ||
          client.giveawayManager.giveaways.find(
            (g) => g.guildId === interaction.guildId && g.messageId === query
          );

        if (!giveaway)
          return interaction.followUp({
            content: `**Couldn't** find a **giveaway** with the ID of "**${query}**".`,
            ephemeral: true,
          });
        const messageId2 = interaction.options.getString("message-id");
        client.giveawayManager
          .reroll(messageId2)
          .then(() => {
            interaction.followUp({
              content: `Your **giveaway** has been **successfuly** rerolled!`,
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