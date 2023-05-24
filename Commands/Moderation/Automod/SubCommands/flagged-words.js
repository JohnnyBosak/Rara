const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  subCommand: "automod.flagged-words",
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */

  async execute(interaction) {
    await interaction.reply({
      content: "<a:RamSpin:750442351570321510> Loading your automod rule..."
    });
    const rule = await interaction.guild.autoModerationRules.create({
      name: "Block profanity, sexual content and slurs by Rara",
      creatorId: "772939602863587368",
      enabled: true,
      eventType: 1,
      triggerType: 4,  // <-- define the trigger_type field
      triggerMetadata: {
        presets: [1, 2, 3],
      },
      actions: [
        {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
          customMessage: "This message was prevented by Rara auto moderation",
        },
      }, 
               ],
    }).catch(async (err) => {
      setTimeout(async () => {
        console.log(err);
        await interaction.editReply({content: `${err}`});
      }, 2000);
    });
    setTimeout(async () => {
      if (!rule) return;
      const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setDescription("✅ Your Automod rule has been created. All swears will be stopped by Rara");
      await interaction.editReply({content: "", embeds: [embed] });
    }, 3000);
  }
}