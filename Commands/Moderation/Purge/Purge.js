const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require("discord.js");
const transcripts = require("discord-html-transcripts");
const database = require("../../../Schemas/ClearLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Bulk delete messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption(options => options
      .setName("amount")
      .setDescription("Provide the amount of messages you intend to delete.")
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
    )
    .addUserOption(options => options
      .setName("target")
      .setDescription("Provide the target member to only delete their messages.")
    )
    .addStringOption(options => options
      .setName("reason")
      .setDescription("Provide the reason why you are clearing these messages.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      const amount = interaction.options.getNumber("amount");
      const reason = interaction.options.getString("reason");
      const target = interaction.options.getUser("target");

      const channelMessages = await interaction.channel.messages.fetch();
      const guildConfig = await database.findOne({
        Guild: interaction.guild.id
      });
      const logChannel = guildConfig ? interaction.guild.channels.cache.get(guildConfig.logChannel) : null;

      const responseEmbed = new EmbedBuilder().setColor("DarkNavy");
      const logEmbed = new EmbedBuilder().setColor("DarkAqua").setAuthor({
        name: "CLEAR COMMAND USED"
      });

      const logEmbedDescription = [
        `• Moderator: ${interaction.member}`,
        `• Target: ${target || "None"}`,
        `• Channel: ${interaction.channel}`,
        `• Reason: ${reason}`
      ];

      let messagesToDelete = [];
      if (target) {
        let i = 0;
        channelMessages.filter(message => {
          if (message.author.id === target.id && i < amount) {
            messagesToDelete.push(message);
            i++;
          }
        });
      } else {
        messagesToDelete = channelMessages.first(amount);
      }

      const transcript = await transcripts.generateFromMessages(messagesToDelete, interaction.channel);

      await Promise.all([
        interaction.channel.bulkDelete(messagesToDelete, true),
        interaction.reply({
          embeds: [responseEmbed.setDescription(`🧹 Cleared ${messagesToDelete.length} messages.`)],
          ephemeral: true
        })
      ]);

      logEmbedDescription.push(`• Total Messages: ${messagesToDelete.length}`);
      if (logChannel) {
        await logChannel.send({
          embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
          files: [transcript]
        });
      }
    } catch (error) {
      console.error(error);
      interaction.reply("An error occurred while executing the command. Please try again later.");
    }
  }
};
