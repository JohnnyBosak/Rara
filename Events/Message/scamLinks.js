const scamLinks = ['discordrgift.com', 'steamdlscord.com', 'steamcomminuly.com', 'discordc.gift', 'steamcomminuty.com', 'discord-gifte.com', 'boostnltro.com', 'discocrd-gift.com', 'rustgive.com', 'discort-nittro.com', 'axieinfinity-bot.io', 'discorde-gift.com', 'discordnltro.xyz', 'discrod-gifts.club', 'dlscordrglft.xyz', 'steamtrading.org', 'discord-full.shop', 'discorde-nitro.com', 'discord-gifft.com', 'dilscordilgifts.com', 'discrode-gifte.club', 'discorte-nitro.xyz', 'dfscord.com', 'discord-up.com', 'discore-nitro.xyz', 'discqrde.com', 'discrods.gift', 'discode.gift', 'up-discord.com', 'dlscord-nt.com', 'discord-s.com', 'stearnocommunity.com'];

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (!message.guild || message.channel.type === "DM") return;

    if (!message.author.bot && message.author.id !== client.user.id && scamLinks.some((scamLink) => message.content.toLowerCase().includes(scamLink))) {

      message.delete().catch((err) => console.error("Error deleting message:", err));

      message.channel.send(`🛑 Attention ${message.author}! We take security seriously in this community. Please refrain from posting any links that may be considered scams or harmful. If you come across any suspicious content, make sure to report it to the moderators immediately. Let's keep this space safe and enjoyable for everyone! Thank you for your cooperation. 🚀`);

      const logChannel = message.guild.channels.cache.get('430778195789348874');
      if (logChannel && logChannel.guild.id === message.guild.id) {
        logChannel.send(`<@!408675103946178561>\n**Warning! Scam link detected in <#${message.channel.id}> from <@!${message.author.id}>**` + '\nMessage content:```' + `${message.content}` + '```');
      }

      message.member.timeout(86400000, "Sharing scam links")
        .catch((err) => console.error("Error applying timeout:", err));
    }
  },
};
