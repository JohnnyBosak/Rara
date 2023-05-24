const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
const ms = require("ms");
const { mongoose } = require(`mongoose`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`giveaway`)
    .setDescription(`Start a giveaway or configure already existing ones.`)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName("start")
        .setDescription("🎉 Starts a giveaway with the specified fields.")
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(
              `Specified duration will be the giveaway's duration (45s, 5m, 1h, 1d)`
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription(
              "Specified amount will be the amount of winners chosen."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription(
              "Specified prize will be the prize for the giveaway."
            )
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specified channel will receive the giveaway.")
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription(
              "Specified content will be used for the giveaway embed."
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`edit`)
        .setDescription(`Edits specified giveaway.`)
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription(
              "Specify the message ID of the giveaway you want to edit."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription(
              "Specify the added duration of the giveaway (45s, 5m, 1h, 1d)."
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Specify the new ammount of winners.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("Specify the new prize for the giveaway.")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("end")
        .setDescription(`⏹️ Ends specified giveaway.`)
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription(
              "Specify the message ID of the giveaway you want to end."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`reroll`)
        .setDescription(`🔃 Rerolls specified giveaway.`)
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription(
              "Specify the message ID of the giveaway you want to reroll."
            )
            .setRequired(true)
        )
    ),
};
