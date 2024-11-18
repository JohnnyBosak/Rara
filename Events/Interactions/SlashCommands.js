const { ChatInputCommandInteraction, ContextMenuInteraction, ApplicationCommandType, PermissionFlagsBits, ChannelType, EmbedBuilder } = require("discord.js");

const requiredPermissions = [
    { permission: PermissionFlagsBits.ViewChannel, message: 'View Channels' },
    { permission: PermissionFlagsBits.SendMessages, message: 'Send Messages' },
    { permission: PermissionFlagsBits.ReadMessageHistory, message: 'Read Message History' },
    { permission: PermissionFlagsBits.ManageMessages, message: 'Manage Messages' },
    { permission: PermissionFlagsBits.AddReactions, message: 'Add Reactions' },
    { permission: PermissionFlagsBits.UseExternalEmojis, message: 'Use External Emojis' }
];

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

      if (interaction.channel.type !== ChannelType.DM) {
          const missingPermissions = requiredPermissions.filter(permission => !interaction.guild.members.me.permissions.has(permission.permission));
          
          if (missingPermissions.length > 0) {
        let sendMessage = "Hey there! <a:RubyWave:1208881264648650762> To make sure I can work my magic smoothly, I'll need a few permissions:\n• View Channels      • Manage Messages\n• Send Messages     • Read Message History\n• Add Reactions      • Use External Emojis.\n\n";

        if (missingPermissions.length === requiredPermissions.length) {
          sendMessage += "It seems like I'm currently missing all of these permissions. <:ZeroTwoShrug:1208885341575184494>\n\n";
        } else
        if (missingPermissions.length < requiredPermissions.length) {
          const missingPermissionsList = missingPermissions.map(permission => permission.message).join('\`, \`');
          sendMessage += `It seems like I'm currently missing ${missingPermissions.length} of these permissions, specifically: \`${missingPermissionsList}\`. <:ZeroTwoNote:1208885345068916828>\n\n`;
        }

        return await interaction.reply({
          content: sendMessage + `If you could grant these permissions, we'll be ready to roll <a:ZeroTwoCool:1208886836357763143>`
        });
      }
    }

      if (command.developer && interaction.user.id !== "408675103946178561") {
        return await interaction.reply({
          content: "This command is only available to the developer.",
          ephemeral: true
        });
      }

      const subCommandGroup = interaction.options.getSubcommandGroup(false);
      const subCommand = interaction.options.getSubcommand(false);

      if (subCommandGroup && subCommand) {
        const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommandGroup}.${subCommand}`);
        if (!subCommandFile) {
          return await interaction.reply({
            content: "This sub-command is outdated.",
            ephemeral: true
          });
        }
        await subCommandFile.execute(interaction, client);

      } else if (subCommand) {
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
        const channel = client.channels.cache.get('1240972685509660713');

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Slash Command Used!`)
        .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
        .addFields({ name: 'Server Name', value: `${interaction.guild.name}  <#${interaction.channelId}>`})
        .addFields({ name: 'Command', value: `</${interaction.commandName}:${interaction.commandId}>`})
        .addFields({ name: 'User', value: `${interaction.user}`})
        .setTimestamp()
        .setFooter({ text: 'Rara Slash Commands Log', iconURL: interaction.client.user.avatarURL({ dynamic: true })})

        channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        }).catch(err => {});
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        }).catch(err => {});
      }
    }
  },
};