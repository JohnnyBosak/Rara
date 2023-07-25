const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display available commands')
    .setDMPermission(false),
  /** 
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    const commands = client.commands;
    const sortedCommands = commands.sort((a, b) => a.data.name.localeCompare(b.data.name));
    const commandList = sortedCommands.map((command) => `**/${command.data.name}**: ${command.data.description}`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle("Hey there, here are my commands")
      .setDescription(`${commandList}`)
      .setColor("DarkButNotBlack")
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
