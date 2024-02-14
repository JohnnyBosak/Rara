const { SlashCommandBuilder } = require('discord.js');
const help = require('../../Events/Buttons/help');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advanced-help')
    .setDescription('Get some help.')
    .setDMPermission(true),

  async execute(interaction) {
    await interaction.reply({ embeds: [help.helpCenterEmbed()], components: [help.helpSelectMenu()] });
  },
};
