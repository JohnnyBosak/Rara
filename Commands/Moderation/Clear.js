const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require("discord.js");
const Transcripts = require("discord-html-transcripts");
const database = require("../../Schemas/ClearLog");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("clear")
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
  .addStringOption(options => options
                  .setName("target")
                   .setDescription("Provide the target member to only delete their messages.")
                  )
  .addStringOption(options => options
                  .setName("reason")
                   .setDescription("Provide the reason why you are clearing these messages.")
                  ),
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    const Amount = interaction.options.getNumber("amount");
    const Reason = interaction.options.getString("reason");
    const Target = interaction.options.getUser("target");

    const channelMessages = await interaction.channel.messages.fetch();
    //const logChannel = interaction.guild.channels.cache.get("429089094690275338"); //hard code guild
    const guildConfig = await database.findOne({
      Guild: interaction.guild.id
    });
    const logChannel = guildConfig ? interaction.guild.channels.cache.get(guildConfig.logChannel) : null;

    const responseEmbed = new EmbedBuilder().setColor("DarkNavy");
    const logEmbed = new EmbedBuilder().setColor("DarkAqua")
    .setAuthor({name: "CLEAR COMMAND USED"});

    let logEmbedDescription = [
      `• Moderator: ${interaction.member}`,
      `• Target: ${Target || "None"}`,
      `• Channel: ${interaction.channel}`,
      `• Reason: ${Reason}`
    ];
    
    if (Target) {
      let i = 0;
      let messagesToDelete = [];
      channelMessages.filter((message) => {
        if (message.author.id === Target.id && i < Amount) {
          messagesToDelete.push(message);
          i++
        }
      });
      
      const Transcript = await Transcripts.generateFromMessages(messagesToDelete, interaction.channel);

      interaction.channel.bulkDelete(messagesToDelete, true).then((messages) => {
        interaction.reply({
          embeds: [responseEmbed.setDescription(`🧹 Cleared \`${messages.size}\` messages from ${Target}.`)], 
          ephemeral: true});

        logEmbedDescription.push(`• Total Messages: ${messages.size}`);
        if (logChannel) {
          logChannel.send({
            embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
            files: [Transcript]
          });
        } else return;
      });
    } else {
      const Transcript = await Transcripts.createTranscript(interaction.channel, { limit: Amount });

      interaction.channel.bulkDelete(Amount, true).then((messages) => {
        interaction.reply({
          embeds: [responseEmbed.setDescription(`🧹 Cleared \`${messages.size}\` messages.`)], 
          ephemeral: true});

        logEmbedDescription.push(`• Total Messages: ${messages.size}`);
        if (logChannel) {
          logChannel.send({
            embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
            files: [Transcript]
          });
        }
      });
    }
  }
}