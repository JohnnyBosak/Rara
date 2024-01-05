const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription('Chat with GPT-3')
    .addStringOption((option) =>
      option.setName('message')
        .setDescription('Your message to GPT-3')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const message = interaction.options.getString('message');

    // Add a prompt before the original message
    const prompt = message;

    const apiUrl = `https://api.artix.cloud/api/v1/AI/Chatgpt?q=${encodeURIComponent(prompt)}`;

    try {

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const chatData = response.data.chat;

        const embed = {
          color: 0x0099ff,
          title: 'Chat with GPT-3',
          description: chatData,
        };

        await interaction.followUp({ embeds: [embed] });
      } else {
        await interaction.followUp('An error occurred while fetching chat data.');
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp('An error occurred while processing your request.');
    }
  },
};
