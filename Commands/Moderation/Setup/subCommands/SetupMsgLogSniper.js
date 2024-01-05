const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const database = require("../../../../Schemas/MSGLog");

module.exports = {
  subCommand: "setup.message_log",
  /** 
   * @param  {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    try {
      const { guild, options } = interaction;

      const del_logChannel = options.getChannel("deleted-messages")?.id || null;
      const edit_logChannel = options.getChannel("edited-messages")?.id || null;

      const del_logChannelMention = del_logChannel ? `<#${del_logChannel}>` : 'not set';
      const edit_logChannelMention = edit_logChannel ? `<#${edit_logChannel}>` : 'not set';

      const guildConfigObject = {
        del_logChannel: del_logChannel,
        edit_logChannel: edit_logChannel,
      };

      await database.findOneAndUpdate(
        { Guild: guild.id },
        guildConfigObject,
        { new: true, upsert: true }
      );

      client.guildConfig.set(guild.id, guildConfigObject);

      const Embed = new EmbedBuilder()
        .setTitle("Message Logging Channels Updated")
        .setColor("Red")
        .setDescription(`- **Deleted messages logging channel :** ${del_logChannelMention}\n- **Edited messages logging channel :** ${edit_logChannelMention}`);

      return interaction.reply({
        embeds: [Embed]
      });
    } catch (error) {
      console.error("Error in setup_msglog command:", error);
      return interaction.reply("An error occurred while processing your request.");
    }
  }
};
