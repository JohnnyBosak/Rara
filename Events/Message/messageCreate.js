const { ChannelType, EmbedBuilder } = require("discord.js");

const scamLinks = ['discordrgift.com', 'steamdlscord.com', 'steamcomminuly.com', 'discordc.gift', 'steamcomminuty.com', 'discord-gifte.com', 'boostnltro.com', 'discocrd-gift.com', 'rustgive.com', 'discort-nittro.com', 'axieinfinity-bot.io', 'discorde-gift.com', 'discordnltro.xyz', 'discrod-gifts.club', 'dlscordrglft.xyz', 'steamtrading.org', 'discord-full.shop', 'discorde-nitro.com', 'discord-gifft.com', 'dilscordilgifts.com', 'discrode-gifte.club', 'discorte-nitro.xyz', 'dfscord.com', 'discord-up.com', 'discore-nitro.xyz', 'discqrde.com', 'discrods.gift', 'discode.gift', 'up-discord.com', 'dlscord-nt.com', 'discord-s.com', 'stearnocommunity.com'];
const blockedUsers = [];

const dmLogChannelId = "818290209710932008";
const scamLogChannelId = '430778195789348874';

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    try {
      // Handle DMs
      if (message.channel.type === ChannelType.DM) {
        if (!message.interaction && message.author.id !== client.user.id && !blockedUsers.some((element) => element === message.author.id)) {
          const embedLogs = new EmbedBuilder()
            .setColor(3066993)
            .setTitle(`💬・New DM message!`)
            .setDescription(`Rara has received a new DM message from ${message.author} (${message.author.tag.replace("#0", "")}) !`)
            .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png' }))
            .addFields(
              {
                name: `Message`,
                value: `${message.content || "None"}`,
                inline: true,
              }
            )
            .setFooter({ text: "Rara Dm box", iconURL: "https://cdn.discordapp.com/avatars/772939602863587368/13e8a9704032f64926ac7f2487110f7b.png" })
            .setTimestamp();

          if (message.attachments.size > 0) {
            let i = 1;
            message.attachments.forEach((attachment) => {
              embedLogs.addFields({
                name: `<:attachment:1133021857591869440>┆Attachment ${i}`,
                value: attachment.url,
                inline: false,
              });
              i++;
            });
          }

          const channel = client.channels.cache.get(dmLogChannelId);

          channel.send({ embeds: [embedLogs] });
        }
      }

      // Scam link detection for guild messages
      if (message.guild && message.channel.type !== ChannelType.DM) {
        if (!message.author.bot && message.author.id !== client.user.id && scamLinks.some((scamLink) => message.content.toLowerCase().includes(scamLink))) {

          message.delete().catch((err) => console.error("Error deleting message:", err));

          message.channel.send(`🛑 Attention ${message.author}! We take security seriously in this community. Please refrain from posting any links that may be considered scams or harmful. If you come across any suspicious content, make sure to report it to the moderators immediately. Let's keep this space safe and enjoyable for everyone! Thank you for your cooperation. 🚀`);

          const logChannel = message.guild.channels.cache.get(scamLogChannelId);
          if (logChannel && logChannel.guild.id === message.guild.id) {
            logChannel.send(`<@!408675103946178561>\n**Warning! Scam link detected in <#${message.channel.id}> from <@!${message.author.id}>**` + '\nMessage content:```' + `${message.content}` + '```');
          }

          message.member.timeout(86400000, "Sharing scam links")
            .catch((err) => console.error("Error applying timeout:", err));
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
