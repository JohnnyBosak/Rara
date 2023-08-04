const { EmbedBuilder, Message } = require("discord.js");
const config = require("../../config.json");
const chDontScan = config.chDontScan;
const database = require("../../Schemas/DelMSGLog");

module.exports = {
  name: "messageDelete",
  /**
   * @param {Message} message
   */
  async execute(message) {
    if (!message ||
        !message.guild ||
        !message.author ||
        message.author.bot ||
        message.channel.type === "DM" ||
        chDontScan.some((element) => element === message.channel.id) ||
        message.deletedByClearCommand
       ) return;

    const guildConfig = await database.findOne({
      Guild: message.guild.id
    });
    const deletedMsgChannelLog = guildConfig ? message.guild.channels.cache.get(guildConfig.logChannel) : null;

    //const deletedMsgChannelLog = message.guild.channels.cache.get("818290104053006336");
    if (deletedMsgChannelLog === null) return;

    // Log the deleted message
    const Log = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username} (message deleted)`,
        iconURL: `${message.author.avatarURL({
          dynamic: true,
          format: "png",
        })}`,
        url: `${message.url}`,
      })
      .setColor("#FF0000")
      .setTimestamp()
      .setDescription(
        `**Deleted Message:**\n ${message.content ? message.content : "None"
          }`.slice(0, 4096)
      )
      .setFooter({
        text: `${message.channel.name}`,
        iconURL: "https://i.ibb.co/s3WkBCw/13e8a9704032f64926ac7f2487110f7b.png",
      });

    if (message.attachments.size >= 1) {
      Log.addFields({
        name: "Attachments :",
        value: `${message.attachments.map((a) => a.url).join("\n")}`,
        inline: true,
      });
    }

    deletedMsgChannelLog.send({
      embeds: [Log]
    }).catch((err) => console.log(err));
  },
};
