const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",

  async execute(reaction, user) {
    if (user.bot || !reaction.message) return;

    let channelTicket = null;
    let sentEmbed = null;
    if (reaction.message.id === '926943492004012032' && reaction.emoji.name === '🎫') {
      reaction.users.remove(user);

      channelTicket = (await reaction.message.guild.channels.create({
        name: `ticket-${user.username}`,
        permissionOverwrites: [{
          id: user.id,
          allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.AddReactions, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks],
          deny: [PermissionFlagsBits.UseApplicationCommands],
        },
        {
          id: reaction.message.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
        },
        {
          id: '408675103946178561',
          allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.AddReactions],
        },
        ],
        type: ChannelType.GuildText,
        parent: '815644916558331904',
      }));

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Welcome To Your Ticket')
        .setDescription(`Thanks for contacting support, <@${user.id}>. Our amazing Staff members will be with you shortly and hope to solve your issues. If you have any other information to provide, please feel free to leave a message.\n\nThanks! | **Grom** Support Team.`)
        .setTimestamp()
        .setFooter({ text: `Ticket created by ${user.tag}` });

      sentEmbed = await channelTicket.send({
        content: `<@${user.id}> successfully created a ticket!`,
        embeds: [embed]
      });
      await sentEmbed.react("⛔");
    }
    /*
        //const channelTicket = reaction.message.guild.channels.cache.find(channel => channel.name.startsWith('ticket-'));
        if (channelTicket && sentEmbed) {
        if (reaction.channel.id === channelTicket.id && reaction.message.id === sentEmbed.id && reaction.emoji.name === '⛔' && user.id !== reaction.message.author.id) {
          reaction.message.channel.send('Member has closed the ticket.');
          channelTicket.setName('ticket-close');
    
          setTimeout(async () => {
            const permissions = channelTicket.permissionOverwrites.cache.get('408675103946178561');
            if (permissions) {
              await permissions.delete();
            }
          }, 2000);
        }
        }
        
    if (channelTicket) {
      for (var i = 0; i < reaction.message.embeds.length; i++) {

        if (reaction.message.embeds[i].title.includes(`Welcome To Your Ticket`) || reaction.message.embeds[i].footer.text.includes(`Ticket created by ${user.username}#${user.discriminator}`)) {
          if (reaction.emoji.name === '⛔') {
            //user.id !== bot.user.id

            reaction.message.channel.send('Member has closed the ticket.');
            reaction.message.channel.setName('ticket-close');

            setTimeout(function() {
              reaction.message.channel.permissionOverwrites.edit('704846426571669611', {
                VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false
              })
            }, 2000); // Time Value in MiliSeconds (2000 = 2 Seconds)
          }
        }
      }
    }
        
        
        
        */
  },
};
