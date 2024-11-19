const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const help = require('../../Events/Buttons/help');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advanced-help')
    .setDescription('Get some help.')
    .setDMPermission(true),

  async execute(interaction) {
    await interaction.reply({ embeds: [help.helpCenterEmbed()], components: [help.helpSelectMenu()] });

    if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.UseExternalEmojis)) {
        await interaction.followUp({ content: `Missing permission: \`Use External Emojis\`. <:ZeroTwoShrug:1208885341575184494>`, ephemeral: true });
    }
  },
};