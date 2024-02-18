const { ContextMenuInteraction, ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("thread")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.SendMessagesInThreads)
    .setDMPermission(false),
  /**
   * 
   * @param {ContextMenuInteraction} interaction 
   */
  async execute(interaction) {
    try {
        //await interaction.reply({ content: `<a:RemSpin:1117793586390515763> Creating thread..` });
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        
        if (!message) { return };
        
        const requiredPermissions = [
            { permission: PermissionFlagsBits.CreatePublicThreads, errorMessage: "create public threads" },
            { permission: PermissionFlagsBits.SendMessagesInThreads, errorMessage: "send messages in threads" },
        ];

        for (const { permission, errorMessage } of requiredPermissions) {
            if (!interaction.guild.members.me.permissions.has(permission)) {
                return await interaction.reply({ content: `I don't have permission to ${errorMessage}. <:ZeroTwoShrug:1208885341575184494>`, ephemeral: true });
            }
        }
        
        if (message.channel.type === ChannelType.GuildText) {
          // Create a thread based on the original message
          const thread = await interaction.channel.threads.create({
            name: `Thread created by ${interaction.user.tag}`,
            autoArchiveDuration: 1440,
            startMessage: message,
        });

          const embed = new EmbedBuilder()
            .setTitle("Thread Created")
            .setDescription(`A thread has been created for the message ${message.url} by ${interaction.user}.`)
            .setColor("#00ff00");

          await interaction.reply({ embeds: [embed] });
            await thread.members.add(message.author);
            await thread.members.add(interaction.user);

        } else {
            await interaction.reply({ content: "This command only works for messages in text channels (does not apply to voice chat channels)", ephemeral: true });
        }

    } catch (err) {
      if (err.code == 50068) {
        await interaction.reply({ content: '<:akko:748932842670653480> Invalid message type.', ephemeral: true });
      } else {
      console.log(err);
      await interaction.reply({ content: '<:akko:748932842670653480> An error occurred.', ephemeral: true });
      }
    }
  },
};
