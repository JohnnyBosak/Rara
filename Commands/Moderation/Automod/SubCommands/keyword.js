const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "automod.keyword",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  * @param {Object} options
  * @param {string} options.word - the keyword to block
  */

  async execute(interaction, options) {
    await interaction.reply({
      content: "<a:RamSpin:750442351570321510> Loading your automod rule..."
    });
    const word = interaction.options.getString('word');
    const rule2 = await interaction.guild.autoModerationRules.create({
      name: `Block Custom Words from being used`,
      creatorId: "772939602863587368",
      enabled: true,
      eventType: 1,
      triggerType: 1,  // <-- define the trigger_type field
      triggerMetadata: {
        keywordFilter: [`${word}`]
      },
      actions: [
        {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
          customMessage: "This message was prevented by Rara auto moderation"
        }
      }
               ]
    }).catch(async (err) => {
      setTimeout(async () => {
        console.log(err);
        await interaction.editReply({content: `${err}`});
      }, 2000)
    })
      setTimeout(async () => {
        if (!rule2) return;
        
        const embed2 = new EmbedBuilder()
          .setColor(0x0000FF)
          .setDescription(`✅ Your Automod rule has been created. All messages containing the word ${word} will be deleted`)
          await interaction.editReply({ content: "", embeds: [embed2] });
      }, 3000)
  }
}