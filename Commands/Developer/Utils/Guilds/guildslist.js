const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("listguilds")
    .setDescription("Lists all guilds Rara is in."),
  async execute(interaction) {
    try {
      const guilds = interaction.client.guilds.cache;
      let guildList = "";

      for (const [guildId, guild] of guilds) {
        const owner = await guild.fetchOwner();

        if (!owner) continue;

        guildList += `**Guild**: ${guild.name} (${guildId})\n`;
        guildList += `**Members**: ${guild.memberCount}\n`;
        guildList += `**Owner**: ${owner.user.tag} (${owner.user.id})\n\n`;
      }
      const embed = new EmbedBuilder()
        .setTitle('Guilds')
        .setDescription(guildList)
        .setColor('Random')
        .setTimestamp();

      await interaction.reply({
        embeds: [embed]
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "An error occurred while listing the guilds.", ephemeral: true });
    }
  },
};
