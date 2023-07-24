const { ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (message.channel.type === ChannelType.DM && message.author.id !== client.user.id) {
      let embedLogs = new EmbedBuilder()
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

      let i = 1;
      message.attachments.forEach((attachment) => {
        embedLogs.addFields({
          name: `<:attachment:1133021857591869440>┆Attachment ${i}`,
          value: attachment.url,
          inline: false,
        });
        i++;
      });
       
      const channel = client.channels.cache.get("430778195789348874");

      return channel.send({ embeds: [embedLogs] });
    }
  },
};
