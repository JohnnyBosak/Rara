const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Ask Chat-GPT for an answer or question!')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addSubcommand((command) => command.setName('question')
      .setDescription('Ask Chat-GPT a question!')
      .addStringOption((option) => option.setName('q-content')
        .setDescription('What do you want to ask?')
        .setRequired(true)),
    )
    .addSubcommand((command) => command.setName('image')
      .setDescription('Ask Chat-GPT to generate an image!')
      .addStringOption((option) => option.setName('i-content')
        .setDescription('What do you want to generate?')
        .setRequired(true)),
    ),
};
