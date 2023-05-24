const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require(`discord.js`);
const ms = require("ms");

module.exports = {
  subCommand: "giveaway.start",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
            // GIVEAWAY START COMMAND CODE //

        await interaction.reply({
          content: `**Starting** your giveaway..`,
          ephemeral: true,
        });

        const { GiveawaysManager } = require("discord-giveaways");

    const durationInput = interaction.options.getString("duration") || "";
    const durationRegex = /^(\d+(?:\.\d+)?)\s*(s|m|h|d|seconds?|minutes?|hours?|days?)$/i;
    const matches = durationInput.match(durationRegex);
    if (!matches) {
      return interaction.followUp({
        content: "❌ | Invalid duration input. Please provide a valid input such as `5m` or `2d`.",
        ephemeral: true,
      });
    }
    const duration = parseFloat(matches[1]);
    const unit = matches[2].toLowerCase();
    const durationInMs = (() => {
      switch (unit) {
        case 's':
        case 'second':
        case 'seconds':
          return duration * 1000;
        case 'm':
        case 'minute':
        case 'minutes':
          return duration * 60 * 1000;
        case 'h':
        case 'hour':
        case 'hours':
          return duration * 60 * 60 * 1000;
        case 'd':
        case 'day':
        case 'days':
          return duration * 24 * 60 * 60 * 1000;
        default:
          return null;
      }
    })();
    if (!durationInMs) {
      return interaction.followUp({
        content: '❌ | Invalid duration unit. Please provide a valid unit such as `s`, `m`, `h`, or `d`.',
        ephemeral: true,
      });
    }
    
    const winnerCount = interaction.options.getInteger("winners");
        const prize = interaction.options.getString("prize");
        const contentmain = interaction.options.getString(`content`);
        const channel = interaction.options.getChannel("channel");
        const showchannel =
          interaction.options.getChannel("channel") || interaction.channel;
        if (!channel && !contentmain)
          client.giveawayManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration: durationInMs,
            hostedBy: interaction.user,
            lastChance: {
              enabled: false,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#7704ba",
            },
          });
        else if (!channel)
          client.giveawayManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration: durationInMs,
            hostedBy: interaction.user,
            lastChance: {
              enabled: true,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#7704ba",
            },
          });
        else if (!contentmain)
          client.giveawayManager.start(channel, {
            prize,
            winnerCount,
            duration: durationInMs,
            hostedBy: interaction.user,
            lastChance: {
              enabled: false,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#7704ba",
            },
          });
        else
          client.giveawayManager.start(channel, {
            prize,
            winnerCount,
            duration: durationInMs,
            hostedBy: interaction.user,
            lastChance: {
              enabled: true,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#7704ba",
            },
          });

        interaction.followUp({
          content: `✅ | Your **giveaway** has started successfuly! Check ${showchannel}.`,
          ephemeral: true,
        });

  }
}
