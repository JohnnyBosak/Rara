const { EmbedBuilder, Message, WebhookClient } = require("discord.js");

const { chDontScan } = require("../../config.json");
const database = require("../../Schemas/MSGLog");

module.exports = {
  name: "messageUpdate",
  /**
   * @param {Message} oldMessage
   * @param {Message} newMessage
   */
  async execute(oldMessage, newMessage) {
    try {
      if (!oldMessage ||
        !oldMessage.guild ||
        !oldMessage.author ||
        oldMessage.author.bot ||
        oldMessage.channel.type === "DM" ||
        chDontScan.some((element) => element === oldMessage.channel.id) ||
        oldMessage.content === newMessage.content
      ) return;

      const guildConfig = await database.findOne({
        Guild: oldMessage.guild.id
      });

      const editedMsgChannelLog = guildConfig ? oldMessage.guild.channels.cache.get(guildConfig.edit_logChannel) : null;
      if (!editedMsgChannelLog) return;

      const Original = oldMessage.content.slice(0, 1950) + (oldMessage.content.length > 1950 ? "..." : "");
      const Edited = newMessage.content.slice(0, 1950) + (newMessage.content.length > 1950 ? "..." : "");

      const Log = new EmbedBuilder()
        .setAuthor({ name: `${newMessage.author.username} (message edited)`, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })}`, url: `${newMessage.url}` })
        .setTimestamp()
        .setColor("#ABB8C3")
        .setDescription(`**Original**:\n ${Original}\n\n**Edited**: \n ${Edited}`.slice(0, 4096))
        .setFooter({ text: `Channel: ${newMessage.channel.name}`, iconURL: 'https://i.ibb.co/s3WkBCw/13e8a9704032f64926ac7f2487110f7b.png' });

      new WebhookClient({ url: process.env.webhookRadelGirl }).send({ embeds: [Log] }).catch((err) => console.log(err));
    } catch (error) {
      console.error("Error in messageUpdate event:", error);
    }
  }
};
