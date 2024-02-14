const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Roast someone')
    .addUserOption(option => option
      .setName('user')
      .setDescription('Select a user.')
      .setRequired(true)
    ),
  async execute(interaction) {

    const { options } = interaction;
    const user = options.getUser('user');

    fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
      .then(res => res.json())
      .then(json => {

        const embed = new EmbedBuilder()
          .setColor('DarkRed')
          .setDescription(`${json.insult}`)
        interaction.reply({ content: `${user}`, embeds: [embed] });
      });
  },
};
