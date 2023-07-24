const { EmbedBuilder, Message, WebhookClient } = require("discord.js");

const config = require("../../config.json");
const chDontScan = config.chDontScan;

module.exports = {
  name: "messageUpdate",
  /**
   * @param {Message} oldMessage
   * @param {Message} newMessage
   */
  execute(oldMessage, newMessage) {
        if (!oldMessage ||
            !oldMessage.guild ||
            !oldMessage.author ||
            oldMessage.author.bot ||
            oldMessage.channel.type === "DM" ||
            chDontScan.some((element) => element === oldMessage.channel.id)
            ) return;
    if (oldMessage.content === newMessage.content) return;

    const Count = 1950;

    const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? "..." : "");
    const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? "..." : "");

    const Log = new EmbedBuilder()
    .setAuthor({ name: `${newMessage.author.username} (message edited)`, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })}`, url: `${newMessage.url}` })
    .setTimestamp()
    .setColor("#ABB8C3")
    .setDescription(`**Original**:\n ${Original}\n\n**Edited**: \n ${Edited}`.slice("0","4096"))
    .setFooter({ text: `Channel: ${newMessage.channel.name}`, iconURL: 'https://i.ibb.co/s3WkBCw/13e8a9704032f64926ac7f2487110f7b.png'});

    new WebhookClient({url: "https://discord.com/api/webhooks/1003324383378538526/oiHOda_eb9WLpsdGFJxVhl8OekwSJ_YD5G2G6f4T6VUrlRmRJSayr8sOW3u0tvlci2rG"}).send({embeds: [Log]}).catch((err) => console.log(err));
    
  }
}
