const { GuildMember, EmbedBuilder } = require("discord.js");
const memberLogDatabase = require("../../Schemas/MemberLog");

module.exports = {
  name: "guildMemberRemove",
  /** 
  *
  * @param {GuildMember} member
  */
  async execute(member) {
    const guildConfig = await memberLogDatabase.findOne({
      Guild: member.guild.id
    });
    if (!guildConfig) return;

    const logChannel = guildConfig ? member.guild.channels.cache.get(guildConfig.logChannel) : null;
    if (!logChannel) return;

    const accountCreation = parseInt(member.user.createdTimestamp / 1000);

    const Embed = new EmbedBuilder()
      .setAuthor({ name: `${member.user.tag} | ${member.id}`, iconURL: member.displayAvatarURL({ dynamic: true }), })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setDescription([
        `• User: ${member.user}`,
        `• Account Type: ${member.user.bot ? "Bot" : "User"}`,
        `• Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
      ].join("\n"))
      .setFooter({ text: "Left" })
      .setTimestamp();

    logChannel.send({ embeds: [Embed] });
  },
};
