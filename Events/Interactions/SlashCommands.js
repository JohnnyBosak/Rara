const { ChatInputCommandInteraction, ContextMenuInteraction, ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /** 
   *
   * @param {ChatInputCommandInteraction | ContextMenuInteraction} interaction
   */
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    try {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        return await interaction.reply({
          content: "This command is outdated.",
          ephemeral: true
        });
      }

      if (command.developer && interaction.user.id !== "408675103946178561") {
        return await interaction.reply({
          content: "This command is only available to the developer.",
          ephemeral: true
        });
      }

      const subCommand = interaction.options.getSubcommand(false);

      if (subCommand) {
        const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
        if (!subCommandFile) {
          return await interaction.reply({
            content: "This sub-command is outdated.",
            ephemeral: true
          });
        }
        await subCommandFile.execute(interaction, client);
      } else {
        await command.execute(interaction, client);
      }
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};
