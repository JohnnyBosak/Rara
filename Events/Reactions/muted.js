const { EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",

  async execute(reaction, user) {
    if (user.bot || !reaction.message) return;

    let threadTicket = null;
    let sentEmbed = null;
    if (reaction.message.id === '926943492004012032' && reaction.emoji.name === '🎫') {
      reaction.users.remove(user);

      const existingThread = reaction.message.channel.threads.cache.find(thread => thread.name === `ticket-${user.username}`);
      if (existingThread) {
        return;
      }

      threadTicket = await reaction.message.channel.threads.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildPrivateThread,
        invitable: false,
        reason: 'Mute appeal',
      }).catch(err => {
        console.error(err);
        return null;
      });

      await threadTicket.members.add(user);

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Welcome To Your Ticket')
        .setDescription(`Thanks for contacting support, <@${user.id}>. Our amazing Staff members will be with you shortly and hope to solve your issues. If you have any other information to provide, please feel free to leave a message.\n\nThanks! | **Grom** Support Team.`)
        .setTimestamp()
        .setFooter({
          text: `Ticket created by ${user.tag}`
        });

      // Create a red button named "Close Ticket"
      const closeButton = new ButtonBuilder()
        .setCustomId('close_ticket')
        .setEmoji('⛔')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Secondary)

      const btnrow = new ActionRowBuilder().addComponents(closeButton);

      sentEmbed = await threadTicket.send({
        embeds: [embed],
        components: [btnrow]
      });
    }
  },
};
