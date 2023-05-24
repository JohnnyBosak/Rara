const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require(`discord.js`);
const ms = require("ms");
const { mongoose } = require(`mongoose`);

module.exports = {
  subCommand: "giveaway.edit",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
            // EDIT GIVEAWAY CODE //

    await interaction.reply({
          content: `**Editing** your giveaway..`,
          ephemeral: true,
        });
    
    const { GiveawaysManager } = require("discord-giveaways");
    const newdurationInput = interaction.options.getString("time");
    const newdurationRegex = /^(\d+(?:\.\d+)?)\s*(s|m|h|d|seconds?|minutes?|hours?|days?)$/i;
    const matches = newdurationInput.match(newdurationRegex);
    if (!matches) {
      return interaction.followUp({
        content: "Invalid duration input. Please provide a valid input such as `5m` or `2d`.",
        ephemeral: true,
      });
    }
    const newduration = parseFloat(matches[1]);
    const unit = matches[2].toLowerCase();

    const newdurationInMs = (() => {
      switch (unit) {
        case 's':
        case 'second':
        case 'seconds':
          return newduration * 1000;
        case 'm':
        case 'minute':
        case 'minutes':
          return newduration * 60 * 1000;
        case 'h':
        case 'hour':
        case 'hours':
          return newduration * 60 * 60 * 1000;
        case 'd':
        case 'day':
        case 'days':
          return newduration * 24 * 60 * 60 * 1000;
        default:
          return null;
      }
    })();
    if (!newdurationInMs) {
      return interaction.followUp({
        content: 'Invalid duration unit. Please provide a valid unit such as `s`, `m`, `h`, or `d`.',
        ephemeral: true,
      });
    }
        const newprize = interaction.options.getString("prize");
        const newwinners = interaction.options.getInteger("winners");
        const messageId = interaction.options.getString("message-id");
        client.giveawayManager
          .edit(messageId, {
            addTime: newdurationInMs,
            newWinnerCount: newwinners,
            newPrize: newprize,
          })
          .then(() => {
            interaction.followUp({
              content: `Your **giveaway** has been **edited** successfuly!`,
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