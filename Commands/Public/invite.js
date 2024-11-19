const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite Rara to your server')
    .setDMPermission(true),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
    .setColor('Red')
    .setAuthor({ name: 'Invite Rara', iconURL: client.user.displayAvatarURL({ size: 64, dynamic: true }) })
    .setTitle('Rara dashboard')
    .setURL('https://johnnybosak.github.io/Rara-Web/')
    .setDescription('[Invite](https://discord.com/oauth2/authorize?client_id=772939602863587368&permissions=68169720393463&scope=bot) me to your server.')
    .setThumbnail('https://i.ibb.co/NFft0BS/rias-gremory.png');

    await interaction.reply({ embeds: [embed], components: [buttons] }).catch((error) => console.log(error));
  },
};

const buttons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setLabel('Invite')
      .setStyle(5)
      .setURL('https://discord.com/oauth2/authorize?client_id=772939602863587368&permissions=68169720393463&scope=bot'),

    new ButtonBuilder()
      .setLabel('Suppport')
      .setStyle(5)
      .setURL('https://discord.gg/8NZTzqDqqt')
  )