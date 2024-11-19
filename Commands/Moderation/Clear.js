const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require("discord.js");
const transcripts = require("discord-html-transcripts");
const database = require("../../Schemas/ClearLog");
const { checkPermissions } = require('../../Utils/checkPermissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption((options) => options
      .setName("amount")
      .setDescription("Provide the amount of messages you intend to delete.")
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
    )
    .addUserOption((options) => options
      .setName("target")
      .setDescription("Provide the target member to only delete their messages.")
    )
    .addStringOption((options) => options
      .setName("reason")
      .setDescription("Provide the reason why you are clearing these messages.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
      const requiredPermissions = ['ViewChannel', 'ReadMessageHistory', 'ManageMessages'];
      const permissionsCheckResult = checkPermissions(interaction, requiredPermissions);

      if (permissionsCheckResult !== true) {
          return;
        }

    await interaction.deferReply({ ephemeral: true });
    
    try {
      const amount = interaction.options.getNumber("amount");
      const reason = interaction.options.getString("reason");
      const target = interaction.options.getUser("target");

      const guildConfig = await database.findOne({
        Guild: interaction.guild.id
      });
      const logChannel = guildConfig ? interaction.guild.channels.cache.get(guildConfig.logChannel) : null;

      let messagesToDelete = [];
      
      if (target) {
        const channelMessages = await interaction.channel.messages.fetch({
          limit: 100
        });
        let i = 0;
        channelMessages.forEach(message => {
          if (message.author.id === target.id && i < amount) {
            messagesToDelete.push(message);
            i++;
          }
        });
      } else {
        const channelMessages = await interaction.channel.messages.fetch({ limit: amount });
        messagesToDelete = Array.from(channelMessages.values());
      }

      const transcript = await transcripts.generateFromMessages(messagesToDelete, interaction.channel);

      const responseEmbed = new EmbedBuilder()
        .setColor("DarkNavy")
        .setDescription(`🧹 Cleared ${messagesToDelete.length} messages.`);

        await interaction.channel.bulkDelete(messagesToDelete, true);
        await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });

      if (logChannel && interaction.guild.members.me.permissionsIn(logChannel).has(PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages | PermissionFlagsBits.AttachFiles)) {
        const logEmbed = new EmbedBuilder()
          .setColor("DarkAqua")
          .setAuthor({ name: "CLEAR COMMAND USED" })
          .setDescription(`
          • Moderator: ${interaction.member}
          \n• Target: ${target || "None"}
          \n• Channel: ${interaction.channel}
          \n• Reason: ${reason || "Not provided"}
          \n• Total Messages: ${messagesToDelete.length}`);

        await logChannel.send({
          embeds: [logEmbed],
          files: [transcript]
        });
      }
    } catch (error) {
      if (error.code === 10062) { return; }
      else {
        console.error(error);
        interaction.editReply("An error occurred while executing the command. Please try again later.");
      }
    }
  }
};