const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "automod.mention-spam.",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  
  async execute(interaction) {
    await interaction.reply({
      content: "<a:RamSpin:750442351570321510> Loading your automod rule..."
    });
    const number = options.getInteger("number");
    const rule4 = await interaction.guild.autoModerationRules.create({
      name: "Prevent spam mentions by Rara",
      creatorId: "772939602863587368",
      enabled: true,
      eventType: 1,
      triggerType: 5,  // <-- define the trigger_type field
      triggerMetadata: {
        mentionTotalLimit: number
                    },
      actions: [
        {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
          customMessage: "This message was prevented by Rara auto moderation"}
        }]
    }).catch(async (err) => {
      setTimeout(async () => {
        console.log(err);
        await interaction.editReply({content: `${err}`});
      }, 2000)
    })
    
      setTimeout(async () => {
        if (!rule4) return;
        
        const embed4 = new EmbedBuilder()
          .setColor(0x0000FF)
          .setDescription("✅ Your Automod rule has been created. All messages suspected of spam will be deleted")
          await interaction.editReply({content: "", embeds: [embed4] });
      }, 3000)
  }
}